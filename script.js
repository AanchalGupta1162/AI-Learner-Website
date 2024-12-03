let transcript = ""; // To store the fetched transcript

// Fetch transcript and display it
document.getElementById('fetch-transcript').addEventListener('click', async () => {
    const videoUrl = document.getElementById('video-url').value.trim();
    if (!videoUrl) {
        alert("Please enter a valid YouTube URL!");
        return;
    }

    try {
        const response = await fetch(`http://127.0.0.1:5000/receive_url?url=${encodeURIComponent(videoUrl)}`);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        transcript = await response.text();
        document.getElementById('transcript').value = transcript;
        document.getElementById('actions-section').classList.remove('hidden');
        alert("Transcript fetched successfully! Now choose an action.");
    } catch (error) {
        console.error("Error fetching transcript:", error);
        alert("Failed to fetch the transcript. Please try again!");
    }
});

// Function to call AI language model for summaries or questions
async function promptAPI(action) {
    const { available } = await ai.languageModel.capabilities();

    if (available !== "no") {
        const session = await ai.languageModel.create();
        const outputElement = document.getElementById('transcript');
        const inputText = outputElement.value.trim();

        let promptText;
        if (action === "summary") {
            promptText = `Summarize and give important points for: ${inputText}`;
        } else if (action === "questions") {
            promptText = `Generate key questions based on: ${inputText}`;
        } else {
            console.error("Invalid action");
            return;
        }

        const result = await session.prompt(promptText);
        document.getElementById('result').value = result;
        document.getElementById('result-section').classList.remove('hidden');
    } else {
        alert("AI language model is not available.");
    }
}

// Get Summary
document.getElementById('get-summary').addEventListener('click', () => {
    promptAPI("summary");
});

// Get Questions
document.getElementById('get-questions').addEventListener('click', () => {
    promptAPI("questions");
});
