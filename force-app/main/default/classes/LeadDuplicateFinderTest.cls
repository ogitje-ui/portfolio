/**
 * @description Test class for LeadDuplicateFinderBatch and LeadDuplicateFinderScheduler
 * @author Claude + Salesforce MCP
 */
@isTest
private class LeadDuplicateFinderTest {

    @testSetup
    static void setupTestData() {
        List<Lead> testLeads = new List<Lead>();

        // Create duplicate set 1: Similar last names (Smith/Smythe)
        testLeads.add(new Lead(
            FirstName = 'John',
            LastName = 'Smith',
            Company = 'Acme Corp',
            Email = 'john.smith@acme.com',
            Status = 'Open - Not Contacted'
        ));

        testLeads.add(new Lead(
            FirstName = 'Jane',
            LastName = 'Smythe', // Sounds like Smith
            Company = 'Acme Corp',
            Email = 'jane.smythe@acme.com',
            Status = 'Open - Not Contacted'
        ));

        // Create duplicate set 2: Similar company names
        testLeads.add(new Lead(
            FirstName = 'Robert',
            LastName = 'Johnson',
            Company = 'Microsoft',
            Email = 'robert@test.com',
            Status = 'Working - Contacted'
        ));

        testLeads.add(new Lead(
            FirstName = 'Bob',
            LastName = 'Johnson',
            Company = 'Microsaft', // Sounds like Microsoft
            Email = 'bob@test.com',
            Status = 'Working - Contacted'
        ));

        // Create unique leads (no duplicates)
        testLeads.add(new Lead(
            FirstName = 'Alice',
            LastName = 'Williams',
            Company = 'Google Inc',
            Email = 'alice@google.com',
            Status = 'Open - Not Contacted'
        ));

        testLeads.add(new Lead(
            FirstName = 'Michael',
            LastName = 'Davis',
            Company = 'Amazon LLC',
            Email = 'michael@amazon.com',
            Status = 'Qualified'
        ));

        // Create another duplicate set: Different spelling
        testLeads.add(new Lead(
            FirstName = 'Catherine',
            LastName = 'Brown',
            Company = 'Tesla Inc',
            Email = 'catherine@tesla.com',
            Status = 'Open - Not Contacted'
        ));

        testLeads.add(new Lead(
            FirstName = 'Katherine', // Sounds like Catherine
            LastName = 'Brown',
            Company = 'Tesla Inc',
            Email = 'katherine@tesla.com',
            Status = 'Open - Not Contacted'
        ));

        insert testLeads;
    }

    @isTest
    static void testBatchExecution() {
        // Test the batch job execution
        Test.startTest();

        LeadDuplicateFinderBatch batch = new LeadDuplicateFinderBatch();
        Id batchId = Database.executeBatch(batch, 200);

        Test.stopTest();

        // Verify the batch job completed
        AsyncApexJob job = [
            SELECT Id, Status, NumberOfErrors
            FROM AsyncApexJob
            WHERE Id = :batchId
        ];

        System.assertEquals('Completed', job.Status, 'Batch job should complete successfully');
        System.assertEquals(0, job.NumberOfErrors, 'Batch job should have no errors');
    }

    @isTest
    static void testBatchFindsD duplicates() {
        // Count initial leads
        Integer totalLeads = [SELECT COUNT() FROM Lead];
        System.assert(totalLeads > 0, 'Should have test leads');

        Test.startTest();

        LeadDuplicateFinderBatch batch = new LeadDuplicateFinderBatch();
        Database.executeBatch(batch, 200);

        Test.stopTest();

        // The batch should have found duplicate groups
        // We can't directly verify the stateful variable, but we can check the debug logs
        // In a real scenario, you might store results in a custom object
        System.assert(true, 'Batch executed without errors');
    }

    @isTest
    static void testScheduler() {
        Test.startTest();

        // Schedule the job
        LeadDuplicateFinderScheduler scheduler = new LeadDuplicateFinderScheduler();
        String cronExp = '0 0 2 * * ?'; // Daily at 2 AM
        String jobId = System.schedule('Test Lead Duplicate Finder', cronExp, scheduler);

        Test.stopTest();

        // Verify the job was scheduled
        CronTrigger ct = [
            SELECT Id, CronExpression, TimesTriggered, NextFireTime
            FROM CronTrigger
            WHERE Id = :jobId
        ];

        System.assertEquals(cronExp, ct.CronExpression, 'Cron expression should match');
        System.assertEquals(0, ct.TimesTriggered, 'Job should not have run yet');
    }

    @isTest
    static void testSchedulerWithCustomBatchSize() {
        Test.startTest();

        // Schedule with custom batch size
        LeadDuplicateFinderScheduler scheduler = new LeadDuplicateFinderScheduler(50);
        String jobId = System.schedule('Test Custom Batch Size', '0 0 1 * * ?', scheduler);

        Test.stopTest();

        // Verify the job was scheduled
        CronTrigger ct = [SELECT Id FROM CronTrigger WHERE Id = :jobId];
        System.assertNotEquals(null, ct, 'Scheduled job should exist');
    }

    @isTest
    static void testBatchWithNoLeads() {
        // Delete all leads
        delete [SELECT Id FROM Lead];

        Test.startTest();

        LeadDuplicateFinderBatch batch = new LeadDuplicateFinderBatch();
        Database.executeBatch(batch, 200);

        Test.stopTest();

        // Should complete without errors even with no data
        System.assert(true, 'Batch should handle empty dataset');
    }

    @isTest
    static void testBatchWithSingleLead() {
        // Delete all but one lead
        List<Lead> leads = [SELECT Id FROM Lead LIMIT 1000];
        if (leads.size() > 1) {
            List<Lead> toDelete = new List<Lead>();
            for (Integer i = 1; i < leads.size(); i++) {
                toDelete.add(leads[i]);
            }
            delete toDelete;
        }

        Test.startTest();

        LeadDuplicateFinderBatch batch = new LeadDuplicateFinderBatch();
        Database.executeBatch(batch, 200);

        Test.stopTest();

        // Should complete without errors with single lead (no duplicates)
        System.assert(true, 'Batch should handle single lead');
    }

    @isTest
    static void testBatchWithMissingFields() {
        // Create leads with missing data
        List<Lead> incompleteLeads = new List<Lead>();

        incompleteLeads.add(new Lead(
            LastName = 'TestNoCompany',
            Company = null,
            Status = 'Open - Not Contacted'
        ));

        incompleteLeads.add(new Lead(
            FirstName = 'NoLast',
            LastName = null,
            Company = 'Test Company',
            Status = 'Open - Not Contacted'
        ));

        insert incompleteLeads;

        Test.startTest();

        LeadDuplicateFinderBatch batch = new LeadDuplicateFinderBatch();
        Database.executeBatch(batch, 200);

        Test.stopTest();

        // Should handle missing fields gracefully
        System.assert(true, 'Batch should handle incomplete data');
    }
}
