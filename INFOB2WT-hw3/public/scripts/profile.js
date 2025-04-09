fetch('/profile/data')
            .then(response => response.json())
            .then(user => {
                document.getElementById('name').textContent = user.first_name;
                document.getElementById('email').textContent = user.email;
            })
            .catch(err => {
                console.error('Fout bij ophalen van gebruikersdata:', err);
            });