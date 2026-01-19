/**
 * @description Utility class for Soundex phonetic algorithm
 * @author Claude + Salesforce MCP
 *
 * Soundex is a phonetic algorithm for indexing names by sound.
 * It converts names to a code so that similar-sounding names share the same code.
 *
 * Example: "Smith" and "Smythe" both encode to "S530"
 */
public class SoundexUtil {

    // Soundex mapping for characters
    private static final Map<String, String> SOUNDEX_MAP = new Map<String, String>{
        'B' => '1', 'F' => '1', 'P' => '1', 'V' => '1',
        'C' => '2', 'G' => '2', 'J' => '2', 'K' => '2', 'Q' => '2', 'S' => '2', 'X' => '2', 'Z' => '2',
        'D' => '3', 'T' => '3',
        'L' => '4',
        'M' => '5', 'N' => '5',
        'R' => '6'
    };

    /**
     * @description Generates Soundex code for a given string
     * @param input The string to encode (typically a name)
     * @return Soundex code (format: Letter + 3 digits, e.g., "S530")
     */
    public static String getSoundex(String input) {
        if (String.isBlank(input)) {
            return '';
        }

        // Convert to uppercase and remove non-alphabetic characters
        String cleanedInput = input.toUpperCase().replaceAll('[^A-Z]', '');

        if (String.isBlank(cleanedInput)) {
            return '';
        }

        // Start with the first letter
        String soundex = cleanedInput.substring(0, 1);
        String previousCode = getCodeForChar(cleanedInput.substring(0, 1));

        // Process remaining characters
        for (Integer i = 1; i < cleanedInput.length() && soundex.length() < 4; i++) {
            String currentChar = cleanedInput.substring(i, i + 1);
            String currentCode = getCodeForChar(currentChar);

            // Add code if it's not empty, not the same as previous, and we need more digits
            if (String.isNotBlank(currentCode) && currentCode != previousCode) {
                soundex += currentCode;
                previousCode = currentCode;
            } else if (String.isBlank(currentCode)) {
                // Reset previous code for vowels/H/W/Y
                previousCode = '';
            }
        }

        // Pad with zeros to make it 4 characters
        while (soundex.length() < 4) {
            soundex += '0';
        }

        return soundex;
    }

    /**
     * @description Gets Soundex code for a single character
     * @param character Single character to encode
     * @return Soundex digit or empty string for vowels/H/W/Y
     */
    private static String getCodeForChar(String character) {
        if (SOUNDEX_MAP.containsKey(character)) {
            return SOUNDEX_MAP.get(character);
        }
        return ''; // Vowels (A, E, I, O, U) and H, W, Y are not coded
    }

    /**
     * @description Compares two strings using Soundex algorithm
     * @param str1 First string to compare
     * @param str2 Second string to compare
     * @return True if both strings have the same Soundex code
     */
    public static Boolean isSoundexMatch(String str1, String str2) {
        if (String.isBlank(str1) || String.isBlank(str2)) {
            return false;
        }

        String soundex1 = getSoundex(str1);
        String soundex2 = getSoundex(str2);

        return soundex1 == soundex2 && String.isNotBlank(soundex1);
    }
}
