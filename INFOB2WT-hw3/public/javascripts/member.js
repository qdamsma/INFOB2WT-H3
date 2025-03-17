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
        if (typeof value !== 'string' || !/^[A-Za-z\u00C0-\u017F\s-]+$/.test(value)) {
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

    #age;
    #hobbies;
    #email;
    #photo;
    #major;
    #courses;
    #intro;
    #head1;
    #texts1;
    #head2;
    #texts2;
    #head3;
    #texts3;
    #head4;
    #texts4;
    #headVak;

    constructor(firstName, lastName, age, hobbies, email, photo, major, courses, intro, head1, texts1, head2, texts2, head3, texts3, head4, texts4, headVak) {

        super(firstName, lastName);
        this.age = age;
        this.hobbies = hobbies;
        this.email = email;
        this.photo = photo;
        this.major = major;
        this.courses = courses.map(course => new Course(course.title, course.teacher, course.description));
        this.intro = intro;
        this.head1 = head1;
        this.texts1 = texts1;
        this.head2 = head2;
        this.texts2 = texts2;
        this.head3 = head3;
        this.texts3 = texts3;
        this.head4 = head4;
        this.texts4 = texts4;
        this.headVak = headVak;
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

    get intro() {
        return this.#intro;
    }

    set intro(value) {
        if (typeof value !== 'string') {
            throw new Error("Ongeldige Intro");
        }
        this.#intro = value;
    }

    get head1() {
        return this.#head1;
    }

    set head1(value) {
        if (typeof value !== 'string') {
            throw new Error("Ongeldige Header");
        }
        this.#head1 = value;
    }

    get texts1() {
        return this.#texts1;
    }

    set texts1(value) {
        if (typeof value !== 'string') {
            throw new Error("Ongeldige Text");
        }
        this.#texts1 = value;
    }

    get head2() {
        return this.#head2;
    }

    set head2(value) {
        if (typeof value !== 'string') {
            throw new Error("Ongeldige Header");
        }
        this.#head2 = value;
    }

    get texts2() {
        return this.#texts2;
    }

    set texts2(value) {
        if (typeof value !== 'string') {
            throw new Error("Ongeldige Text");
        }
        this.#texts2 = value;
    }

    get head3() {
        return this.#head3;
    }

    set head3(value) {
        this.#head3 = value;
    }

    get texts3() {
        return this.#texts3;
    }

    set texts3(value) {
        this.#texts3 = value;
    }

    get head4() {
        return this.#head4;
    }

    set head4(value) {
        this.#head4 = value;
    }

    get texts4() {
        return this.#texts4;
    }

    set texts4(value) {
        this.#texts4 = value;
    }

    get headVak(){
        return this.#headVak;
    }

    set headVak(value){
        this.#headVak = value;
    }
}

// Functie om JSON-bestand in te laden
const fileInput = document.getElementById('fileInput');
if (fileInput) {
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = JSON.parse(e.target.result);
            const student = new Student(
                data.firstName, data.lastName, data.age, data.hobbies, data.email, data.photo, data.major,
                data.courses, data.introduction, data.head1, data.texts1, data.head2, data.texts2, data.head3, data.texts3, data.head4, data.texts4, data.headVak
            );
            displayStudent(student);
        };
        reader.readAsText(file);
    });
}

// Functie om de data te displayen
function displayStudent(student) {
    localStorage.setItem('studentData', JSON.stringify(student));

    const mainContainer = document.getElementById('mainContent');

    // Maakt een kaart aan en voegt de klasse toe
    const card = document.createElement('a');
    card.classList.add('card');
    card.href = "member.html";

    // Maakt image element aan
    const img = document.createElement('img');
    img.src = student.photo;
    img.alt = student.firstName;
    img.classList.add("card__image", "card__image--Mem1");

    // Naam toevoegen
    const name = document.createElement('h2');
    name.textContent = student.firstName;
    name.classList.add("card__header");

    // Intro toevoegen
    const intro = document.createElement('p');
    intro.textContent = student.intro;
    intro.classList.add("card__paragraph");

    // Voeg alle elementen toe aan de kaart
    card.append(img, name, intro);

    card.addEventListener('click', () => {
        localStorage.setItem('studentData', JSON.stringify({
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
            intro: student.intro,
            head1: student.head1,
            texts1: student.texts1,
            head2: student.head2,
            texts2: student.texts2,
            head3: student.head3,
            texts3: student.texts3,
            head4: student.head4,
            texts4: student.texts4,
            headVak: student.headVak
        }));
    });

    // Voeg de kaart toe aan de pagina
    mainContainer.appendChild(card);
}

document.addEventListener('DOMContentLoaded', function () {
    const studentData = localStorage.getItem('studentData');

    if (studentData) {
        const data = JSON.parse(studentData);

        const courses = Array.isArray(data.courses) ? data.courses.map(course => 
            new Course(
                course.title, 
                course.teacher ? new Person(course.teacher.firstName, course.teacher.lastName) : null, 
                course.description
            )
        ) : [];

        const student = new Student(
            data.firstName, 
            data.lastName, 
            data.age, 
            data.hobbies, 
            data.email, 
            data.photo, 
            data.major,
            courses, 
            data.intro, 
            data.head1, 
            data.texts1, 
            data.head2, 
            data.texts2, 
            data.head3, 
            data.texts3, 
            data.head4, 
            data.texts4, 
            data.headVak
        );

        showStudentDetails(student);
    } else {
        console.warn("Geen student data gevonden in localStorage.");
    }
});

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

    const intro = document.createElement('p');
    intro.textContent = student.intro;
    intro.classList.add("card__paragraph");

    card.append(img, name, intro);

    const head1 = document.createElement('h3');
    head1.textContent = student.head1;
    head1.classList.add("about-textbox__head");
    about.appendChild(head1);

    const texts1 = document.createElement('p');
    texts1.textContent = student.texts1;
    texts1.classList.add("about-textbox__para");
    about.appendChild(texts1);

    const head2 = document.createElement('h3');
    head2.textContent = student.head2;
    head2.classList.add("about-textbox__head");
    about.appendChild(head2);

    const texts2 = document.createElement('p');
    texts2.textContent = student.texts2;
    texts2.classList.add("about-textbox__para");
    about.appendChild(texts2);

    const head3 = document.createElement('h3');
    head3.textContent = student.head3;
    head3.classList.add("about-textbox__head");
    about.appendChild(head3);

    const texts3 = document.createElement('p');
    texts3.textContent = student.texts3;
    texts3.classList.add("about-textbox__para");
    about.appendChild(texts3);

    const head4 = document.createElement('h3');
    head4.textContent = student.head4;
    head4.classList.add("about-textbox__head");
    about.appendChild(head4);

    const texts4 = document.createElement('p');
    texts4.textContent = student.texts4;
    texts4.classList.add("about-textbox__para");
    about.appendChild(texts4);

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

    const headVak = document.createElement('h3');
    headVak.textContent = student.headVak;
    headVak.classList.add("about-textbox__head");

    about.appendChild(headVak);
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
