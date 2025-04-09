class Person {

    #firstName;
    #lastName;


    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    get firstName() {
        return this.#firstName;
    }

    set firstName(value) {
        console.log("Setting firstName:", value);
        if (typeof value !== 'string') {
            throw new Error("Ongeldige Voornaam");
        }
        this.#firstName = value;
    }

    get lastName() {
        return this.#lastName;
    }

    set lastName(value) {
        if (typeof value !== 'string') {
            throw new Error("Ongeldige achternaam");
        }
        this.#lastName = value;
    }
}

class Course {

    #title;
    #teacher;
    #description;

    constructor(title, teacher, description) {
        this.title = title;
        this.teacher = new Person(teacher.firstName, teacher.lastName);
        this.description = description;
    }

    get title() {
        return this.#title;
    }

    set title(value) {
        console.log("Setting title:", value);
        if (typeof value !== 'string') {
            throw new Error("Ongeldige Titel");
        }
        this.#title = value;
    }

    get teacher(){
        return this.#teacher;
    }

    set teacher(value) {
        if (typeof value === 'string') {
            const [firstName, ...lastName] = value.split(" ");
            this.#teacher = new Person(firstName, lastName.join(" "));
        } else if (typeof value === 'object' && value !== null && 'firstName' in value && 'lastName' in value) {
            this.#teacher = new Person(value.firstName, value.lastName);
        } else {
            throw new Error("Ongeldige Teacher (naam)");
        }
    }

    get description() {
        return this.#description;
    }

    set description(value) {
        if (typeof value !== 'string') {
            throw new Error("Ongeldige Beschrijving");
        }
        this.#description = value;
    }
}

class Student extends Person {
    #id
    #age;
    #hobbies;
    #email;
    #photo;
    #major;
    #courses;

    constructor(id, firstName, lastName, age, hobbies, email, photo, major, courses) {
        super(firstName, lastName);
        this.id = id;
        this.age = age;
        this.hobbies = hobbies;
        this.email = email;
        this.photo = photo;
        this.major = major;
        this.courses = courses.map(course => new Course(course.title, course.teacher, course.description));
    }
    
    get id() {
        return this.#id;
    }

    set id(value) {
        if (typeof value !== 'number') {
            throw new Error("Ongeldige id");
        }
        this.#id = value;
    }

    get age() {
        return this.#age;
    }

    set age(value) {
        if (typeof value !== 'number' || value < 0 || value > 120) {
            throw new Error("Ongeldige Leeftijd");
        }
        this.#age = value;
    }

    get hobbies() {
        return this.#hobbies;
    }

    set hobbies(value) {
        if (!Array.isArray(value)) {
            throw new Error("Hobbies moet een array zijn")
        }
        this.#hobbies = value;
    }

    get email() {
        return this.#email;
    }

    set email(value) {
        if (typeof value !== 'string') {
            throw new Error("Ongeldige Email");
        }
        this.#email = value;       
    }

    get photo() {
        return this.#photo;
    }

    set photo(value) {
        if (typeof value !== 'string') {
            throw new Error("Ongeldige Foto");
        }
        this.#photo = value;
    }

    get major() {
        return this.#major;
    }

    set major(value) {
        if (typeof value !== 'string' || !/^[A-Za-z\u00C0-\u017F\s-]+$/.test(value)) {
            throw new Error("Ongeldige Major");
        }
        this.#major = value;
    }

    get courses() {
        return this.#courses;
    }

    set courses(value) {
        if (!Array.isArray(value)) {
            throw new Error("Course moet een array zijn");
        }
    
        if (!value.every(value => value instanceof Course)) {
            throw new Error("Alle courses moet van de course class zijn");
        }
        this.#courses = value;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const studentId = params.get('id');

    if (!studentId) {
        console.error("Geen student ID gevonden in de URL.");
        return;
    }

    fetch(`/api/students/${studentId}`)
        .then(res => {
            if (!res.ok) throw new Error("Student niet gevonden");
            return res.json();
        })
        .then(student => {
            document.getElementById('name').textContent = student.firstName;
            document.getElementById('email').textContent = student.email;
        })
        .catch(err => {
            console.error("Fout bij het ophalen van student:", err.message);
        });
});

// Functie om de data te displayen
function displayStudent(student) {

    const mainContainer = document.getElementById('mainContent');

    // Maakt een kaart aan en voegt de klasse toe
    const card = document.createElement('a');
    card.classList.add('student-card');
    card.href = `/student?id=${student.id}`;

    // Maakt image element aan
    const img = document.createElement('img');
    img.src = student.photo ? student.photo : '../images/icon.png';
    img.alt = student.firstName;
    img.classList.add("student-card__image", "card__image--Mem1");

    // Naam toevoegen
    const name = document.createElement('h2');
    name.textContent = student.firstName;
    name.classList.add("card__header");

    // Voeg alle elementen toe aan de kaart
    card.append(img, name);

    card.addEventListener('click', () => {
        localStorage.setItem('studentData', JSON.stringify({
            id: student.id,
            firstName: student.firstName,
            lastName: student.lastName,
            age: student.age,
            hobbies: student.hobbies,
            email: student.email,
            photo: student.photo,
            major: student.major,
            courses: student.courses.map(course => ({
                title: course.title,
                teacher: {
                    firstName: course.teacher.firstName,
                    lastName: course.teacher.lastName
                },
                description: course.description
            })),
        }));
    });

    // Voeg de kaart toe aan de pagina
    mainContainer.appendChild(card);
}

function showStudentDetails(student) {
    const content = document.getElementById('memberContainer');
    if (!content) {
        return;
    }

    const card = document.createElement('section');
    card.classList.add('card');

    const about = document.createElement('article');
    about.classList.add('about-textbox');

    const img = document.createElement('img');
    img.src = student.photo;
    img.alt = student.firstName;
    img.classList.add("card__image", "card__image--Mem1");

    const name = document.createElement('h2');
    name.textContent = student.firstName;
    name.classList.add("card__header");

    card.append(img, name);

    const hobbyList = document.createElement('ul');
    hobbyList.classList.add("about-textbox__list");

    student.hobbies.forEach(hobby => {
        const listItem = document.createElement('li');
        listItem.textContent = hobby;
        hobbyList.appendChild(listItem);
    });
    
    const courseList = document.createElement('ul');
    courseList.classList.add("course-list");


    student.courses.forEach(course => {
        const courseItem = document.createElement('li');
        courseItem.classList.add("course-item");
        courseItem.textContent = course.title;

        const tooltip = document.createElement('section');
        tooltip.classList.add("tooltip")
        tooltip.textContent = course.description;
        tooltip.style.display = "none";
        
        courseItem.appendChild(tooltip);
        courseList.appendChild(courseItem);
    });

    about.appendChild(hobbyList);
    about.appendChild(courseList);

    content.appendChild(card);
    content.appendChild(about);

    courseList.addEventListener('mouseover', function (event) {
        const target = event.target.closest('.course-item');
        if (target) {
            const tooltip = target.querySelector('.tooltip');
            if (tooltip) {
                tooltip.style.display = "block";
            }
        }
    });

    courseList.addEventListener('mouseout', function (event) {
        const target = event.target.closest('.course-item');
        if (target) {
            const tooltip = target.querySelector('.tooltip');
            if (tooltip) {
                tooltip.style.display = "none";
            }
        }
    });
}