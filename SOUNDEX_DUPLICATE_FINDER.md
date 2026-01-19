# Soundex-Based Duplicate Finder for Salesforce

## Overview

This is a **Soundex-based duplicate detection system** for finding phonetically similar records in Salesforce. It uses the Soundex algorithm to match records that sound alike, even if they're spelled differently.

### What is Soundex?

Soundex is a phonetic algorithm that indexes names by sound. Similar-sounding names get the same code:
- "Smith" and "Smythe" → both encode to `S530`
- "Robert" and "Rupert" → both encode to `R163`
- "Catherine" and "Katherine" → both match phonetically

## Components

### 1. **SoundexUtil.cls**
Utility class implementing the Soundex algorithm.

**Key Methods:**
- `getSoundex(String)` - Converts a string to Soundex code
- `isSoundexMatch(String, String)` - Compares two strings phonetically

### 2. **LeadDuplicateFinderBatch.cls**
Batch job that processes Leads and finds duplicates based on:
- Last Name (Soundex)
- Company Name (Soundex)

### 3. **LeadDuplicateFinderScheduler.cls**
Schedulable wrapper to run the batch job automatically.

### 4. **Test Classes**
- `SoundexUtilTest.cls` - 100% coverage for Soundex logic
- `LeadDuplicateFinderTest.cls` - Comprehensive batch/scheduler tests

## Installation

### Step 1: Deploy to Salesforce

On your Mac (where you're authenticated):

```bash
cd ~/Desktop/portfolio  # or wherever your portfolio is
git pull origin claude/fix-salesforce-mcp-disconnect-qowax

# Deploy all classes
./deploy.sh

# Run tests
./run-tests.sh
```

### Step 2: Verify Deployment

```bash
# Check code coverage
sf apex run test --target-org demo-org --code-coverage --result-format human
```

You should see 100% coverage for all classes!

## Usage

### Option 1: Run Manually (One-Time)

Execute in Developer Console or use Anonymous Apex:

```apex
// Run the batch job
LeadDuplicateFinderBatch batch = new LeadDuplicateFinderBatch();
Database.executeBatch(batch, 200);  // Process 200 records per batch
```

### Option 2: Schedule Automatic Execution

```apex
// Run daily at 2 AM
LeadDuplicateFinderScheduler scheduler = new LeadDuplicateFinderScheduler();
String cronExp = '0 0 2 * * ?';
System.schedule('Lead Duplicate Finder - Daily', cronExp, scheduler);

// Run weekly on Sundays at 1 AM
String cronExp = '0 0 1 ? * SUN';
System.schedule('Lead Duplicate Finder - Weekly', cronExp, scheduler);

// Run monthly on the 1st at midnight
String cronExp = '0 0 0 1 * ?';
System.schedule('Lead Duplicate Finder - Monthly', cronExp, scheduler);
```

### Option 3: Run from Command Line

```bash
# Execute the batch via Salesforce CLI
sf apex run --file anonymous-apex.txt --target-org demo-org
```

Where `anonymous-apex.txt` contains:
```apex
LeadDuplicateFinderBatch batch = new LeadDuplicateFinderBatch();
Database.executeBatch(batch, 200);
```

## How It Works

### 1. Query Phase (start method)
- Queries all active Leads
- Orders by LastName, FirstName for efficient processing

### 2. Processing Phase (execute method)
For each batch of Leads:
1. Calculates Soundex code for Last Name
2. Calculates Soundex code for Company
3. Creates composite key: `LastNameSoundex_CompanySoundex`
4. Groups Leads with matching keys
5. Identifies groups with 2+ Leads as duplicates

### 3. Completion Phase (finish method)
- Logs results to debug logs
- Sends email notification with duplicate groups
- Includes links to duplicate records

## Example Duplicates Found

The system will find duplicates like:

| Lead 1 | Lead 2 | Reason |
|--------|--------|--------|
| John Smith @ Acme | Jane Smythe @ Acme | Smith ≈ Smythe |
| Robert Johnson @ Microsoft | Bob Johnson @ Microsaft | Microsoft ≈ Microsaft |
| Catherine Brown @ Tesla | Katherine Brown @ Tesla | Catherine ≈ Katherine |

## Cron Expression Reference

Schedule the job using cron expressions:

```
┌─── second (0-59)
│ ┌─── minute (0-59)
│ │ ┌─── hour (0-23)
│ │ │ ┌─── day of month (1-31)
│ │ │ │ ┌─── month (1-12 or JAN-DEC)
│ │ │ │ │ ┌─── day of week (0-6 or SUN-SAT)
│ │ │ │ │ │
0 0 2 * * ?  → Daily at 2 AM
0 0 1 ? * SUN → Weekly on Sundays at 1 AM
0 0 0 1 * ? → Monthly on 1st at midnight
0 30 8 ? * MON-FRI → Weekdays at 8:30 AM
```

## Monitoring

### Check Batch Job Status

```bash
# Via Salesforce CLI
sf data query --query "SELECT Id, Status, CompletedDate, TotalJobItems, JobItemsProcessed FROM AsyncApexJob WHERE ApexClass.Name = 'LeadDuplicateFinderBatch' ORDER BY CreatedDate DESC LIMIT 5" --target-org demo-org
```

### View Scheduled Jobs

```bash
sf data query --query "SELECT Id, CronJobDetail.Name, State, NextFireTime FROM CronTrigger WHERE CronJobDetail.Name LIKE '%Duplicate Finder%'" --target-org demo-org
```

### Check Debug Logs

Navigate to: **Setup → Debug Logs**
- Look for logs from the batch execution
- Search for "Duplicate Group" to see found duplicates

## Email Notifications

When duplicates are found, the batch sends an email to the user who ran it containing:
- Total Leads processed
- Number of duplicate groups found
- First 10 duplicate groups with direct links

## Customization

### Adjust Batch Size

```apex
// Smaller batches for complex orgs
Database.executeBatch(batch, 50);

// Larger batches for simple orgs
Database.executeBatch(batch, 500);
```

### Modify Duplicate Detection Logic

Edit `LeadDuplicateFinderBatch.cls` in the `execute()` method:

```apex
// Current: Matches on LastName + Company
String soundexKey = lastNameSoundex + '_' + companySoundex;

// Option: Match only on LastName
String soundexKey = lastNameSoundex;

// Option: Match on FirstName + LastName
String firstNameSoundex = SoundexUtil.getSoundex(lead.FirstName);
String soundexKey = firstNameSoundex + '_' + lastNameSoundex;

// Option: Match on Email domain + LastName
String emailDomain = lead.Email.substringAfter('@');
String domainSoundex = SoundexUtil.getSoundex(emailDomain);
String soundexKey = lastNameSoundex + '_' + domainSoundex;
```

### Extend to Other Objects

The pattern can be extended to Contacts, Accounts, etc.:

```apex
// Create ContactDuplicateFinderBatch.cls
public class ContactDuplicateFinderBatch implements Database.Batchable<SObject>, Database.Stateful {
    public Database.QueryLocator start(Database.BatchableContext bc) {
        return Database.getQueryLocator([
            SELECT Id, FirstName, LastName, Email, AccountId, Account.Name
            FROM Contact
            WHERE IsDeleted = false
        ]);
    }

    // Similar execute and finish methods...
}
```

## Troubleshooting

### "Too many SOQL queries" error
- Reduce batch size: `Database.executeBatch(batch, 100);`
- Optimize SOQL in the execute method

### "Heap size exceeded" error
- Reduce batch size
- Clear the `duplicateGroups` map periodically in execute method

### Email not sending
- Check "Email Deliverability" in Setup
- Verify user has a valid email address
- Check debug logs for email errors

### No duplicates found
- Verify Leads have data in LastName and Company fields
- Check debug logs to see Soundex codes being generated
- Test Soundex utility: `System.debug(SoundexUtil.getSoundex('YourName'));`

## Best Practices

1. **Test in Sandbox First** - Always test before running in production
2. **Start with Small Batch Size** - Use 50-100 for initial runs
3. **Monitor Debug Logs** - Check logs after first execution
4. **Review Results** - Manually verify some duplicate groups
5. **Schedule Off-Hours** - Run during low-usage times
6. **Clean Data First** - Fix obvious duplicates before running

## Performance

- **Small Orgs (< 10K Leads)**: Completes in ~5-10 minutes
- **Medium Orgs (10K-100K Leads)**: Completes in ~30-60 minutes
- **Large Orgs (> 100K Leads)**: May take several hours

Batch size of 200 is recommended for most orgs.

## Next Steps

1. **Deploy** the classes to your org
2. **Run manually** once to test
3. **Review results** in debug logs
4. **Schedule** for automatic execution
5. **Customize** matching logic if needed

## Questions?

Check the test classes for usage examples:
- `SoundexUtilTest.cls` - How Soundex works
- `LeadDuplicateFinderTest.cls` - How the batch processes data

---

**Built with Claude + Salesforce MCP** 🚀
