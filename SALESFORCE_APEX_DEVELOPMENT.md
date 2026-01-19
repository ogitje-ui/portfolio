# Salesforce Apex Development with Claude MCP

Now that your Salesforce MCP is connected, you can use Claude to help you build Salesforce apps with Apex!

## What You Can Do with Salesforce MCP

### 1. **Create Apex Classes**
Ask Claude to help you build Apex classes:
- Business logic classes
- Controller classes for Lightning components
- Batch classes
- Schedulable classes
- Queueable classes
- API integrations

### 2. **Create Apex Triggers**
Build triggers for your objects:
- Before/After Insert
- Before/After Update
- Before/After Delete
- Before/After Undelete

### 3. **Write Test Classes**
Generate comprehensive test coverage:
- Unit tests for Apex classes
- Test data factories
- Mock HTTP callouts
- Test triggers

### 4. **Deploy to Salesforce**
Push your code directly to the org:
- Deploy Apex classes
- Deploy triggers
- Run tests
- Check code coverage

### 5. **Query and Analyze Data**
Understand your data model:
- SOQL queries
- Describe objects and fields
- Analyze relationships
- Export data

## Example Prompts to Use in Claude Desktop

### Creating an Apex Class
```
"Create an Apex class called LeadProcessor that:
- Takes a list of Leads
- Updates their Status to 'Working - Contacted'
- Logs the update time
- Includes error handling
- Has a test class with 100% coverage"
```

### Creating a Trigger
```
"Create a trigger on the Lead object that:
- Runs before insert
- Auto-populates the LeadSource if it's null
- Sets it to 'Web' by default
- Include a test class"
```

### Creating a Batch Class
```
"Create a batch Apex class that:
- Processes all Leads with Status = 'Open'
- That haven't been contacted in 30 days
- Updates their Status to 'Closed - Not Converted'
- Sends an email summary when done
- Include test class"
```

### Deploying Code
```
"Deploy the LeadProcessor class to my Salesforce org and run the tests"
```

### Querying Data
```
"Query all Leads created in the last 7 days and group them by LeadSource"
```

## Quick Apex Examples

### 1. Simple Apex Class
```apex
public class LeadHelper {

    public static void updateLeadStatus(List<Lead> leads, String newStatus) {
        for (Lead l : leads) {
            l.Status = newStatus;
        }

        try {
            update leads;
        } catch (DmlException e) {
            System.debug('Error updating leads: ' + e.getMessage());
        }
    }
}
```

### 2. Apex Trigger Example
```apex
trigger LeadTrigger on Lead (before insert, before update) {

    if (Trigger.isBefore) {
        if (Trigger.isInsert || Trigger.isUpdate) {
            for (Lead l : Trigger.new) {
                if (String.isBlank(l.LeadSource)) {
                    l.LeadSource = 'Web';
                }
            }
        }
    }
}
```

### 3. Test Class Example
```apex
@isTest
private class LeadHelperTest {

    @isTest
    static void testUpdateLeadStatus() {
        // Create test data
        List<Lead> testLeads = new List<Lead>();
        for (Integer i = 0; i < 5; i++) {
            testLeads.add(new Lead(
                FirstName = 'Test',
                LastName = 'Lead ' + i,
                Company = 'Test Company',
                Status = 'Open - Not Contacted'
            ));
        }
        insert testLeads;

        // Test the method
        Test.startTest();
        LeadHelper.updateLeadStatus(testLeads, 'Working - Contacted');
        Test.stopTest();

        // Verify results
        List<Lead> updatedLeads = [SELECT Status FROM Lead WHERE Id IN :testLeads];
        for (Lead l : updatedLeads) {
            System.assertEquals('Working - Contacted', l.Status);
        }
    }
}
```

## Deployment Commands

### Deploy Apex Class
```bash
# Deploy a single class
sf project deploy start --source-dir force-app/main/default/classes/LeadHelper.cls --target-org demo-org

# Deploy with tests
sf project deploy start --source-dir force-app/main/default/classes --target-org demo-org --test-level RunLocalTests
```

### Run Tests
```bash
# Run specific test class
sf apex run test --class-names LeadHelperTest --target-org demo-org --result-format human

# Run all tests
sf apex run test --target-org demo-org --result-format human --code-coverage
```

### Retrieve Existing Apex
```bash
# Get all Apex classes
sf project retrieve start --metadata ApexClass --target-org demo-org

# Get specific class
sf project retrieve start --metadata ApexClass:LeadHelper --target-org demo-org
```

## MCP Toolsets for Development

Your MCP is configured with all toolsets. Here's what each does:

- **orgs** - Manage org connections
- **metadata** - Deploy/retrieve metadata (Apex, triggers, Lightning components)
- **data** - Query and manipulate data (SOQL/SOSL)
- **users** - User management
- **apex** - Execute anonymous Apex, run tests

## Best Practices

1. **Always write test classes** - Aim for 100% code coverage
2. **Use bulkified code** - Handle lists, not single records
3. **Follow naming conventions** - Clear, descriptive names
4. **Error handling** - Use try-catch blocks
5. **Governor limits** - Be aware of Salesforce limits
6. **Use trigger frameworks** - Avoid recursive triggers
7. **Test in sandbox first** - Never deploy directly to production

## Example Workflow

1. **Ask Claude to create Apex class**
   - "Create a LeadProcessor class..."

2. **Review the code** Claude generates

3. **Ask Claude to create test class**
   - "Create a test class for LeadProcessor with full coverage"

4. **Deploy to Salesforce**
   - Claude can deploy using MCP tools
   - Or you can deploy manually: `sf project deploy...`

5. **Run tests**
   - Verify code works and has good coverage

6. **Iterate**
   - Ask Claude to modify, enhance, or fix issues

## Pro Tips

- **Describe your requirements clearly** - The more detail, the better code Claude generates
- **Ask for test classes too** - Don't forget test coverage!
- **Request error handling** - Always include exception handling
- **Specify bulkification** - Ask for bulk-safe code
- **Request comments** - Ask Claude to add inline documentation
- **Validate before deploying** - Review generated code before pushing to prod

## Your Org Details

- **Org Alias**: `demo-org`
- **Username**: `babicko@plauti.com`
- **Org ID**: `00D2X000002BIYnUAO`
- **Default Target Org**: Yes (globally set)

## Next Steps

Try asking Claude (in Desktop with MCP connected):

1. "Show me all custom objects in my Salesforce org"
2. "Create an Apex class that processes Leads with specific criteria"
3. "Generate a trigger handler pattern for the Lead object"
4. "Create a batch job to clean up old data"

Happy coding! 🚀
