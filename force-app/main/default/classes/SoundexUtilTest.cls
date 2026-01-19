/**
 * @description Test class for SoundexUtil
 * @author Claude + Salesforce MCP
 */
@isTest
private class SoundexUtilTest {

    @isTest
    static void testGetSoundex_BasicNames() {
        // Test classic Soundex examples
        System.assertEquals('R163', SoundexUtil.getSoundex('Robert'), 'Robert should encode to R163');
        System.assertEquals('R163', SoundexUtil.getSoundex('Rupert'), 'Rupert should encode to R163');
        System.assertEquals('S530', SoundexUtil.getSoundex('Smith'), 'Smith should encode to S530');
        System.assertEquals('S530', SoundexUtil.getSoundex('Smythe'), 'Smythe should encode to S530');
    }

    @isTest
    static void testGetSoundex_CaseInsensitive() {
        // Test case insensitivity
        System.assertEquals('J525', SoundexUtil.getSoundex('JOHNSON'), 'JOHNSON should encode correctly');
        System.assertEquals('J525', SoundexUtil.getSoundex('johnson'), 'johnson should encode correctly');
        System.assertEquals('J525', SoundexUtil.getSoundex('JoHnSoN'), 'JoHnSoN should encode correctly');
    }

    @isTest
    static void testGetSoundex_WithSpaces() {
        // Test names with spaces
        System.assertEquals('J500', SoundexUtil.getSoundex('John'), 'John should encode to J500');
        System.assertEquals('J500', SoundexUtil.getSoundex('John Doe'), 'John Doe should encode to J500 (first name only)');
    }

    @isTest
    static void testGetSoundex_SpecialCharacters() {
        // Test with special characters
        System.assertEquals('O250', SoundexUtil.getSoundex('O\'Brien'), 'O\'Brien should encode correctly');
        System.assertEquals('M240', SoundexUtil.getSoundex('Mc-Donald'), 'Mc-Donald should encode correctly');
    }

    @isTest
    static void testGetSoundex_EdgeCases() {
        // Test edge cases
        System.assertEquals('', SoundexUtil.getSoundex(''), 'Empty string should return empty');
        System.assertEquals('', SoundexUtil.getSoundex(null), 'Null should return empty');
        System.assertEquals('', SoundexUtil.getSoundex('123'), 'Numbers only should return empty');
        System.assertEquals('', SoundexUtil.getSoundex('!!!'), 'Special chars only should return empty');
        System.assertEquals('A000', SoundexUtil.getSoundex('A'), 'Single letter should work');
    }

    @isTest
    static void testGetSoundex_SimilarNames() {
        // Test phonetically similar names
        String soundex1 = SoundexUtil.getSoundex('Catherine');
        String soundex2 = SoundexUtil.getSoundex('Katherine');
        System.assertEquals(soundex1, soundex2, 'Catherine and Katherine should have same Soundex');

        String soundex3 = SoundexUtil.getSoundex('Stephen');
        String soundex4 = SoundexUtil.getSoundex('Steven');
        System.assertEquals(soundex3, soundex4, 'Stephen and Steven should have same Soundex');
    }

    @isTest
    static void testIsSoundexMatch_Matching() {
        // Test matching pairs
        System.assertEquals(true, SoundexUtil.isSoundexMatch('Smith', 'Smythe'), 'Smith and Smythe should match');
        System.assertEquals(true, SoundexUtil.isSoundexMatch('Robert', 'Rupert'), 'Robert and Rupert should match');
        System.assertEquals(true, SoundexUtil.isSoundexMatch('JOHNSON', 'johnson'), 'Case should not matter');
    }

    @isTest
    static void testIsSoundexMatch_NotMatching() {
        // Test non-matching pairs
        System.assertEquals(false, SoundexUtil.isSoundexMatch('Smith', 'Johnson'), 'Smith and Johnson should not match');
        System.assertEquals(false, SoundexUtil.isSoundexMatch('Robert', 'Michael'), 'Robert and Michael should not match');
    }

    @isTest
    static void testIsSoundexMatch_EdgeCases() {
        // Test edge cases
        System.assertEquals(false, SoundexUtil.isSoundexMatch('', ''), 'Empty strings should not match');
        System.assertEquals(false, SoundexUtil.isSoundexMatch(null, null), 'Nulls should not match');
        System.assertEquals(false, SoundexUtil.isSoundexMatch('Smith', ''), 'Smith and empty should not match');
        System.assertEquals(false, SoundexUtil.isSoundexMatch('', 'Smith'), 'Empty and Smith should not match');
        System.assertEquals(false, SoundexUtil.isSoundexMatch('Smith', null), 'Smith and null should not match');
    }

    @isTest
    static void testGetSoundex_CompanyNames() {
        // Test with company names (useful for Lead/Account matching)
        System.assertEquals('A251', SoundexUtil.getSoundex('Acme'), 'Acme should encode correctly');
        System.assertEquals('A251', SoundexUtil.getSoundex('Acmee'), 'Acmee should match Acme');

        String soundex1 = SoundexUtil.getSoundex('Microsoft');
        String soundex2 = SoundexUtil.getSoundex('Microsaft');
        System.assertEquals(soundex1, soundex2, 'Similar company names should match');
    }
}
