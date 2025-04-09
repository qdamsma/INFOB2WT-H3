fetch('/group19/profile/data')
    .then(response => response.json())
    .then(data => {
        console.log('Ontvangen data:', data);
        const user = data.user;
        const requests = data.requests;

        console.log('User:', user);
console.log('Requests:', requests);

        // Vul de gebruikersinformatie in
        document.getElementById('name').textContent = user.first_name;
        document.getElementById('email').textContent = user.email;

        // Toon de vriendschapsverzoeken
        const requestsList = document.getElementById('friend-requests');
        if (requests.length > 0) {
            requests.forEach(request => {
                const requestElement = document.createElement('li');
                requestElement.textContent = `${request.first_name} ${request.last_name} heeft een vriendschapsverzoek gestuurd.`;
                requestsList.appendChild(requestElement);
            });
        } else {
            requestsList.textContent = 'Geen vriendschapsverzoeken.';
        }
    })
    .catch(err => {
        console.error('Fout bij ophalen van gebruikersdata:', err);
    });