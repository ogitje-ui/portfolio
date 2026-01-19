/**
 * @description Schedulable class to run Lead Duplicate Finder batch job
 * @author Claude + Salesforce MCP
 *
 * Schedule this to run automatically:
 *
 * // Run daily at 2 AM
 * LeadDuplicateFinderScheduler scheduler = new LeadDuplicateFinderScheduler();
 * String cronExp = '0 0 2 * * ?';
 * System.schedule('Lead Duplicate Finder - Daily', cronExp, scheduler);
 *
 * // Run weekly on Sundays at 1 AM
 * String cronExp = '0 0 1 ? * SUN';
 * System.schedule('Lead Duplicate Finder - Weekly', cronExp, scheduler);
 */
public class LeadDuplicateFinderScheduler implements Schedulable {

    private Integer batchSize;

    /**
     * @description Default constructor with batch size of 200
     */
    public LeadDuplicateFinderScheduler() {
        this.batchSize = 200;
    }

    /**
     * @description Constructor with custom batch size
     * @param batchSize Number of records to process per batch
     */
    public LeadDuplicateFinderScheduler(Integer batchSize) {
        this.batchSize = batchSize;
    }

    /**
     * @description Execute method called by the scheduler
     */
    public void execute(SchedulableContext sc) {
        System.debug('Starting scheduled Lead Duplicate Finder...');

        LeadDuplicateFinderBatch batch = new LeadDuplicateFinderBatch();
        Database.executeBatch(batch, batchSize);
    }
}
