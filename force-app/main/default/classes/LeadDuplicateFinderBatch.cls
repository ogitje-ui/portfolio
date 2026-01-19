/**
 * @description Batch job to find duplicate Leads using Soundex algorithm
 * @author Claude + Salesforce MCP
 *
 * This batch job:
 * - Processes all Leads in the org
 * - Uses Soundex to find phonetically similar names
 * - Groups duplicates together
 * - Can be scheduled to run periodically
 *
 * Usage:
 *   LeadDuplicateFinderBatch batch = new LeadDuplicateFinderBatch();
 *   Database.executeBatch(batch, 200);
 */
public class LeadDuplicateFinderBatch implements Database.Batchable<SObject>, Database.Stateful {

    // Track duplicate groups found
    private Map<String, List<Id>> duplicateGroups = new Map<String, List<Id>>();
    private Integer totalProcessed = 0;
    private Integer duplicatesFound = 0;

    /**
     * @description Start method - queries all active Leads
     */
    public Database.QueryLocator start(Database.BatchableContext bc) {
        System.debug('Starting Lead Duplicate Finder Batch...');

        return Database.getQueryLocator([
            SELECT Id, FirstName, LastName, Company, Email, Phone
            FROM Lead
            WHERE IsDeleted = false
            ORDER BY LastName, FirstName
        ]);
    }

    /**
     * @description Execute method - processes each batch of Leads
     */
    public void execute(Database.BatchableContext bc, List<Lead> scope) {
        System.debug('Processing batch of ' + scope.size() + ' leads');

        // Create a map of Soundex codes to Lead IDs
        Map<String, List<Lead>> soundexToLeads = new Map<String, List<Lead>>();

        for (Lead lead : scope) {
            totalProcessed++;

            // Generate Soundex code for last name
            String lastNameSoundex = '';
            if (String.isNotBlank(lead.LastName)) {
                lastNameSoundex = SoundexUtil.getSoundex(lead.LastName);
            }

            // Generate Soundex code for company name
            String companySoundex = '';
            if (String.isNotBlank(lead.Company)) {
                companySoundex = SoundexUtil.getSoundex(lead.Company);
            }

            // Create composite key for matching
            String soundexKey = lastNameSoundex + '_' + companySoundex;

            if (String.isNotBlank(soundexKey) && soundexKey != '_') {
                if (!soundexToLeads.containsKey(soundexKey)) {
                    soundexToLeads.put(soundexKey, new List<Lead>());
                }
                soundexToLeads.get(soundexKey).add(lead);
            }
        }

        // Find duplicates (groups with more than 1 lead)
        for (String soundexKey : soundexToLeads.keySet()) {
            List<Lead> matchingLeads = soundexToLeads.get(soundexKey);

            if (matchingLeads.size() > 1) {
                // Found duplicates!
                List<Id> leadIds = new List<Id>();
                for (Lead lead : matchingLeads) {
                    leadIds.add(lead.Id);
                }

                // Store or merge with existing duplicates
                if (duplicateGroups.containsKey(soundexKey)) {
                    duplicateGroups.get(soundexKey).addAll(leadIds);
                } else {
                    duplicateGroups.put(soundexKey, leadIds);
                    duplicatesFound += matchingLeads.size();
                }

                System.debug('Found duplicate group (' + soundexKey + '): ' + matchingLeads.size() + ' leads');
            }
        }
    }

    /**
     * @description Finish method - logs results and can send notifications
     */
    public void finish(Database.BatchableContext bc) {
        System.debug('======================================');
        System.debug('Lead Duplicate Finder Batch Complete');
        System.debug('======================================');
        System.debug('Total Leads Processed: ' + totalProcessed);
        System.debug('Duplicate Groups Found: ' + duplicateGroups.size());
        System.debug('Total Duplicates: ' + duplicatesFound);
        System.debug('======================================');

        // Log detailed duplicate information
        for (String soundexKey : duplicateGroups.keySet()) {
            List<Id> leadIds = duplicateGroups.get(soundexKey);
            System.debug('Duplicate Group [' + soundexKey + ']: ' + leadIds.size() + ' leads - ' + String.join(leadIds, ', '));
        }

        // Optional: Send email notification
        if (duplicatesFound > 0) {
            sendEmailNotification(bc);
        }
    }

    /**
     * @description Sends email notification with batch results
     */
    private void sendEmailNotification(Database.BatchableContext bc) {
        try {
            Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();

            // Get the batch job details
            AsyncApexJob job = [
                SELECT Id, Status, NumberOfErrors, JobItemsProcessed, TotalJobItems, CreatedBy.Email
                FROM AsyncApexJob
                WHERE Id = :bc.getJobId()
            ];

            String[] toAddresses = new String[] { job.CreatedBy.Email };
            email.setToAddresses(toAddresses);
            email.setSubject('Lead Duplicate Finder - Results');

            String emailBody = 'Lead Duplicate Finder Batch Job Results:\n\n';
            emailBody += 'Status: ' + job.Status + '\n';
            emailBody += 'Total Leads Processed: ' + totalProcessed + '\n';
            emailBody += 'Duplicate Groups Found: ' + duplicateGroups.size() + '\n';
            emailBody += 'Total Duplicates: ' + duplicatesFound + '\n\n';

            if (duplicateGroups.size() > 0) {
                emailBody += 'Duplicate Groups (showing first 10):\n';
                emailBody += '================================\n';

                Integer count = 0;
                for (String soundexKey : duplicateGroups.keySet()) {
                    if (count >= 10) break;

                    List<Id> leadIds = duplicateGroups.get(soundexKey);
                    emailBody += '\nGroup ' + (count + 1) + ' [' + soundexKey + ']: ' + leadIds.size() + ' leads\n';

                    for (Id leadId : leadIds) {
                        emailBody += '  - ' + URL.getSalesforceBaseUrl().toExternalForm() + '/' + leadId + '\n';
                    }

                    count++;
                }
            }

            email.setPlainTextBody(emailBody);
            Messaging.sendEmail(new Messaging.SingleEmailMessage[] { email });

            System.debug('Email notification sent successfully');
        } catch (Exception e) {
            System.debug('Error sending email notification: ' + e.getMessage());
        }
    }
}
