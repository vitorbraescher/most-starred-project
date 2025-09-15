const searchButton = document.querySelector('#search-button');
const repoCard = document.getElementById('repo-card');
const repoName = document.getElementById('repo-name');
const repoStars = document.getElementById('repo-stars');
const repoAuthor = document.getElementById('repo-author');
const repoDescription = document.getElementById('repo-description');
const githubLink = document.getElementById('github-link');
const cardSubtitle = document.getElementById('card-subtitle');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const loadingContainer = document.getElementById('loading-container');
const errorMessage = document.getElementById('error-message');

const fetchMostStarredProject = async () => {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    let query = '';
    let subtitle = '';

    if (startDate && endDate) {
        query = `created:${startDate}..${endDate}`;
        subtitle = `within selected date range (${startDate} to ${endDate})`;
    } else {
        query = `stars:>1`; 
        subtitle = `from all time`;
    }

    const apiUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=1`;

    loadingContainer.classList.remove('hidden');
    repoCard.classList.add('hidden');
    errorMessage.classList.add('hidden');

    try {
        const res = await fetch(apiUrl);
        if (!res.ok) {
            throw new Error(`Failed to fetch GitHub api. Status: ${res.status}`)
        }
        
        const data = await res.json();
        if (data.items && data.items.length > 0) {
            const repo = data.items[0];

            repoCard.classList.remove('hidden');
            repoName.textContent = repo.full_name;
            repoName.href = repo.html_url;
            repoStars.textContent = new Intl.NumberFormat().format(repo.stargazers_count);
            repoAuthor.textContent = repo.owner.login;
            repoDescription.textContent = repo.description || "No description available.";
            githubLink.href = repo.html_url;
            cardSubtitle.textContent = subtitle;
        } else {
            errorMessage.classList.remove('hidden');
            errorMessage.textContent = 'No repositories found in that date range.';
        }
    } catch (error) {
        console.error(`Failed to fetch GitHub api: ${error}`);
        errorMessage.classList.remove('hidden');
        errorMessage.textContent = 'Failed to fetch data. Please check your network connection.';
    } finally {
        loadingContainer.classList.add('hidden');
    }
}

searchButton.addEventListener('click', fetchMostStarredProject);

// Initial search on page load for a default value
fetchMostStarredProject();