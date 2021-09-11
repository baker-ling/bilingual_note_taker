// Global constants for various keys
const PAST_MEETINGS_LS_KEY = "past_meetings"; // TODO: Make sure same keys is used for storing past meeting metadata in local storage
const PAST_MEETING_ID_SEARCH_PARAM_KEY = "past_meeting_name";
const CURRENT_MEETING_SESSION_KEY = 'current_meeting';
const PAST_MEETING_URLSEARCHPARAM_FLAG = "?past_meeting=true";

// objects for converting langauge codes to names and vice-versa
const langCodesToNames = {
    "en": "English",
    "ar": "Arabic",
    "zh": "Chinese",
    "fr": "French",
    "de": "German",
    "hi": "Hindi",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "ko": "Korean",
    "pl": "Polish",
    "pt": "Portuguese",
    "ru": "Russian",
    "es": "Spanish",
    "tr": "Turkish",
    "vi": "Vietnamese"
  };
  
  const langNamesToCodes = {
    "English": "en",
    "Arabic": "ar",
    "Chinese": "zh",
    "French": "fr",
    "German": "de",
    "Hindi": "hi",
    "Indonesian": "id",
    "Irish": "ga",
    "Italian": "it",
    "Japanese": "ja",
    "Korean": "ko",
    "Polish": "pl",
    "Portuguese": "pt",
    "Russian": "ru",
    "Spanish": "es",
    "Turkish": "tr",
    "Vietnamese": "vi"
  };

  
/**
 * Gets a machine translation from libretranslate.de
 * @param {string} sourceText - Text to be translated
 * @param {string} sourceLanguage - Language of text to be translated
 * @param {string} targetLanguage - Language to be translated into
 * @returns {string} Machine translation result.
 */
async function getTranslation(sourceText, sourceLanguage, targetLanguage) {
    const requestResult = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      body: JSON.stringify({
        q: sourceText,
        source: sourceLanguage,
        target: targetLanguage,
      }),
      headers: { "Content-type": "application/json" },
    });
  
    const data = await requestResult.json();
    return data.translatedText;
  }


  function getSourceLanguageForCurrentMeeting() {
    return langNamesToCodes[meetingMetadata.sourceLanguage];
  }
  
  function getTargetLanguageForCurrentMeeting() {
    return langNamesToCodes[meetingMetadata.targetLanguage];
  }