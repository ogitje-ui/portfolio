/**
 * @description Test class for ExampleLeadProcessor
 * @author Claude + Salesforce MCP
 */
@isTest
private class ExampleLeadProcessorTest {

    @testSetup
    static void setupTestData() {
        List<Lead> testLeads = new List<Lead>();

        for (Integer i = 0; i < 5; i++) {
            testLeads.add(new Lead(
                FirstName = 'Test',
                LastName = 'Lead ' + i,
                Company = 'Test Company ' + i,
                Status = 'Open - Not Contacted',
                Email = 'testlead' + i + '@example.com'
            ));
        }

        insert testLeads;
    }

    @isTest
    static void testUpdateLeadStatus() {
        // Get test leads
        List<Lead> testLeads = [SELECT Id, Status FROM Lead LIMIT 5];
        System.assertEquals(5, testLeads.size(), 'Should have 5 test leads');

        // Test updating status
        Test.startTest();
        ExampleLeadProcessor.updateLeadStatus(testLeads, 'Working - Contacted');
        Test.stopTest();

        // Verify results
        List<Lead> updatedLeads = [SELECT Status FROM Lead WHERE Id IN :testLeads];
        for (Lead l : updatedLeads) {
            System.assertEquals('Working - Contacted', l.Status, 'Lead status should be updated');
        }
    }

    @isTest
    static void testGetLeadsByStatus() {
        // Test querying by status
        Test.startTest();
        List<Lead> openLeads = ExampleLeadProcessor.getLeadsByStatus('Open - Not Contacted');
        Test.stopTest();

        // Verify results
        System.assertEquals(5, openLeads.size(), 'Should return 5 leads');
        for (Lead l : openLeads) {
            System.assertEquals('Open - Not Contacted', l.Status);
        }
    }

    @isTest
    static void testUpdateLeadStatusWithNullList() {
        // Test with null list
        Test.startTest();
        ExampleLeadProcessor.updateLeadStatus(null, 'Working - Contacted');
        Test.stopTest();

        // Should not throw exception
        System.assert(true, 'Should handle null list gracefully');
    }

    @isTest
    static void testUpdateLeadStatusWithEmptyList() {
        // Test with empty list
        Test.startTest();
        ExampleLeadProcessor.updateLeadStatus(new List<Lead>(), 'Working - Contacted');
        Test.stopTest();

        // Should not throw exception
        System.assert(true, 'Should handle empty list gracefully');
    }
}
