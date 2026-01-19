/**
 * @description Example Apex class for processing Leads
 * @author Claude + Salesforce MCP
 */
public class ExampleLeadProcessor {

    /**
     * @description Updates lead status for a list of leads
     * @param leads List of leads to process
     * @param newStatus The status to set
     */
    public static void updateLeadStatus(List<Lead> leads, String newStatus) {
        if (leads == null || leads.isEmpty()) {
            return;
        }

        List<Lead> leadsToUpdate = new List<Lead>();

        for (Lead lead : leads) {
            lead.Status = newStatus;
            leadsToUpdate.add(lead);
        }

        try {
            update leadsToUpdate;
            System.debug('Successfully updated ' + leadsToUpdate.size() + ' leads');
        } catch (DmlException e) {
            System.debug('Error updating leads: ' + e.getMessage());
            throw e;
        }
    }

    /**
     * @description Queries leads by status
     * @param status The status to filter by
     * @return List of leads with the specified status
     */
    public static List<Lead> getLeadsByStatus(String status) {
        return [
            SELECT Id, Name, Email, Company, Status, CreatedDate
            FROM Lead
            WHERE Status = :status
            ORDER BY CreatedDate DESC
            LIMIT 100
        ];
    }
}
