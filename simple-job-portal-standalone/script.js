document.addEventListener('DOMContentLoaded', () => {
    const roleSelect = document.getElementById('role-select');
    const companySelect = document.getElementById('company-select');
    const resultContainer = document.getElementById('result-container');
    const emptyState = document.getElementById('empty-state');
    const jobTitle = document.getElementById('job-title');
    const companyName = document.getElementById('company-name');
    const jobLink = document.getElementById('job-link');
    const companyLogo = document.getElementById('company-logo');

    const jobDatabase = {
        'uiux': {
            'accenture': {
                title: 'Senior UI/UX Designer',
                company: 'Accenture',
                link: 'https://www.accenture.com/in-en/careers/jobdetails?id=AT12345_india',
                logo: 'https://logo.clearbit.com/accenture.com'
            }
        },
        'frontend': {
            'google': {
                title: 'Senior Frontend Engineer',
                company: 'Google',
                link: 'https://careers.google.com/jobs/results/',
                logo: 'https://logo.clearbit.com/google.com'
            }
        },
        'microsoft': {
             'microsoft': {
                title: 'Software Engineer II',
                company: 'Microsoft',
                link: 'https://careers.microsoft.com/',
                logo: 'https://logo.clearbit.com/microsoft.com'
            }
        }
    };

    function updateView() {
        const role = roleSelect.value;
        const company = companySelect.value;

        if (role && company) {
            const job = jobDatabase[role]?.[company];

            if (job) {
                // Populate data
                jobTitle.textContent = job.title;
                companyName.textContent = job.company;
                jobLink.href = job.link;
                companyLogo.src = job.logo;

                // Show result
                resultContainer.classList.remove('hidden');
                emptyState.style.display = 'none';
                
                // Add a little pop animation
                resultContainer.style.animation = 'none';
                resultContainer.offsetHeight; // trigger reflow
                resultContainer.style.animation = 'scaleIn 0.4s ease-out';
            } else {
                // No match
                resultContainer.classList.add('hidden');
                emptyState.style.display = 'block';
                emptyState.innerHTML = `<p style="color: #ef4444;">No specific link found for this combination.</p>`;
            }
        } else {
            resultContainer.classList.add('hidden');
            emptyState.style.display = 'block';
            emptyState.innerHTML = `<p>Select role and company to see available links.</p>`;
        }
    }

    roleSelect.addEventListener('change', updateView);
    companySelect.addEventListener('change', updateView);
});
