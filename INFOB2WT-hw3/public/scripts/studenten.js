console.log("studenten.js is geladen");
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/students')
        .then(response => response.json())
        .then(data => {
            data.forEach(studentData => {
                try {
                    const student = new Student(
                        studentData.id,
                        studentData.firstName,
                        studentData.lastName,
                        studentData.age,
                        studentData.hobbies,
                        studentData.email,
                        studentData.photo,
                        studentData.major,
                        studentData.courses,
                    );

                    displayStudent(student);
                    showStudentDetails(student);
                } catch (error) {
                    console.error("Kon student niet aanmaken:", studentData.firstName, error.message);
                }
            });
        })
        .catch(err => {
            console.error("Kon studenten niet laden:", err);
        });
});