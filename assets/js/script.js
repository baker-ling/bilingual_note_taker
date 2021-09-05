/**
 * Callback function for original note textareas to automatically
 * translate contents.
 * @param {Event} event 
 */
function translateTextareaCallback(event) {
    translateTextarea(event.target);
}

/**
 * Translates text in the given source text textarea 
 * to its corresponding translation text textarea.
 * @param {HTMLTextAreaElement} sourceTextarea 
 */
async function translateTextarea(sourceTextarea) {
    const sourceText = sourceTextarea.value;
    const sourceLanguage = getSourceLanguage();
    const targetLanguage = getTargetLanguage();
    const targetTextarea = getTargetTextarea(sourceTextarea);
    const translationText = await getTranslation(sourceText, sourceLanguage, targetLanguage);
    targetTextarea.value = translationText;
}

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
            target: targetLanguage
        }),
        headers: {"Content-type": "application/json"}
    });

    const data = await requestResult.json();
    return data.translatedText;
}

/**
 * Returns the textarea element that is supposed to hold the translation
 * for the given source text textarea element.
 * @param {HTMLTextAreaElement} sourceTextarea 
 * @returns {HTMLTextAreaElement} Translation textarea corresponding to sourceTextarea
 */
function getTargetTextarea(sourceTextarea) {
    return sourceTextarea.parentElement.querySelector('.note-translation');
}

function getSourceLanguage() {
    // TODO implement proper logic for getSourceLanguage
    return 'en';
}

function getTargetLanguage() {
    // TODO implement proper logic for getTargetLanguage
    return 'es';
}