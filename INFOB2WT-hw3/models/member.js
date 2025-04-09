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

    #id
    #age;
    #hobbies;
    #email;
    #photo;
    #major;
    #courses;

    constructor(id, firstName, lastName, age, hobbies, email, photo, major, courses) {

        this.id = id;
        super(firstName, lastName);
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

module.exports = {
    Person,
    Course,
    Student
};