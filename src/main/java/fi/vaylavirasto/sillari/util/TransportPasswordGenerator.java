package fi.vaylavirasto.sillari.util;

import org.passay.CharacterData;
import org.passay.CharacterRule;
import org.passay.PasswordData;
import org.passay.PasswordGenerator;
import org.passay.PasswordValidator;
import org.passay.RepeatCharactersRule;
import org.passay.RuleResult;

// Note: This password generator uses https://github.com/vt-middleware/passay
// More information about the available password rules can be found at http://www.passay.org/reference/
public class TransportPasswordGenerator {
    public static final int PASSWORD_LENGTH = 8;
    public static final String ALLOWED_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // Not I, l, O
    public static final String ALLOWED_DIGITS = "23456789"; // not 0, 1
    public static final String ERROR_CODE = "ERRONEOUS_CHARS";

    public static String generate() {
        PasswordGenerator gen = new PasswordGenerator();

        // Define the rules for generating a password based on the allowed characters listed above
        // There must be at least two letters and two digits from the allowed characters
        CharacterData allowedLetters = new CharacterData() {
            public String getErrorCode() {
                return ERROR_CODE;
            }

            public String getCharacters() {
                return ALLOWED_CHARACTERS;
            }
        };
        CharacterRule allowedLettersRule = new CharacterRule(allowedLetters);
        allowedLettersRule.setNumberOfCharacters(2);

        CharacterData allowedDigits = new CharacterData() {
            public String getErrorCode() {
                return ERROR_CODE;
            }

            public String getCharacters() {
                return ALLOWED_DIGITS;
            }
        };
        CharacterRule allowedDigitsRule = new CharacterRule(allowedDigits);
        allowedDigitsRule.setNumberOfCharacters(2);

        // Define the rules for validating a password
        // There must not be any repeated characters
        RepeatCharactersRule noRepeatedCharsRule = new RepeatCharactersRule(2);

        // Generate a password and validate it, then if not valid, generate another password
        // A for loop is used instead of a while loop just as a precaution against a possible infinite loop
        // With the no repeated characters rule, a valid password is usually obtained in 1-3 attempts
        PasswordValidator validator = new PasswordValidator(noRepeatedCharsRule);
        String password = "";
        for (int i = 0; i < 100; i++) {
            password = gen.generatePassword(PASSWORD_LENGTH, allowedLettersRule, allowedDigitsRule);
            // System.out.println(String.format("i %s password %s", i, password));

            RuleResult validationResult = validator.validate(new PasswordData(password));
            if (validationResult.isValid()) {
                break;
            }
        }

        return password;
    }
}
