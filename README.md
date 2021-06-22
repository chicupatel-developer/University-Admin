# DotNet Core + Angular + React

Server side technology: .net core web api, ef core- code first, sql server, repository pattern, custom jwt authentication, google oauth2 authentication


client side technology: angular, react, html, css, javascript, bootstrap


db tables: [departments], [faculties], [courses], [assignments], [asmtUploads] (assignment upload), [students], [stdstocourses] (students to courses), [stdtoasmt] (students to assignments)
db context: UniversityContext.cs

db tables: [AspNetUsers] (all Users (Admin/Student)), [AspNetRoles] (Admin/Student - Roles), [AspNetUserLogins] (external(google) - signin)
db context: ApplicationDbContext.cs


/////////////// system info ///////////////

** exceptions handling: 
- Model validations are handled on Client side - Angular - Component
- all Server side exceptions are handled on Api - Controller / C# Service
- all File Upload/Download related exceptions are handled on Api/Controller and Angular/Component

//// Role based Authentication Process
- JWT Authentication
- sign-in using Google Authentication and Custom JWT Authentication
- either [Student] or [Admin] Role is created during Registration
- after successful Sign-in, respective Role is returned in Token / Response
- Angular stores Role info with Token
- Header menu component displays related menu options as per Role info
- when User bypasses Header menu options and directly types url then, on Server side
Api's Controller code checks with [Authorize("Admin")] and if un-authorised then,
returns 403 (Forbidden)
- on Angular side auth.interceptor.ts file catches 403 and, redirects to Home page
else if (err.status == 403){
                            // not authorise
                            // redirect to home page
                            this.router.navigateByUrl('/home');
                        }

---> [Signin]
- User can sign-in
- after successful sign-in, Token, Role and other User's information is stored
on Client side and menu options are displayed as per User's Role
- after un-successful sign-in, error message is displayed
** exceptions handling

---> [Registration]
- User can be either Admin or Student
- @ Registration process, Admin - role profile is created.
- for Student - Role, first need to create Student @ Student db table__
- and then after @ Registration process, select Student - Role and __
- map already created Student with Student - Role profile.
- after un-successful Registration, error message is displayed
** exceptions handling

---> [Department]-[Faculty]-[Course] Relationship
// Course can not exist without Department and Faculty
// one Course can connect with one Department and one Faculty
// Department has multiple Courses and Caculties
// Faculty can have multiple or zero Course(s)
// Faculty can not exist without Department
// Department - Faculty - Course entities initialization sequence...
- first create Department
- second create Faculty... Faculty needs only Department
- third create Course... Course needs both Department and Faculty

---> [Department] (Role - Admin)
- User can add / edit / view Department
- User can remove Department
    - Faculty, Course and Assignment are depending on Department
    - before User can remove Department, system displays all possible dependencies
    - when User execute remove Department action, system safely remove first
        all possible dependencies and finally remove Department itself
** exceptions handling

---> [Faculty] (Role - Admin)
- User can add / edit / view Faculty
- User can remove Faculty
    - Course and Assignment are depending on Faculty
    - before User can remove Faculty, system displays all possible dependencies
    - when User execute remove Faculty action, system safely remove first
        all possible dependencies and finally remove Faculty itself
** exceptions handling

---> [Course] (Role - Admin)
- User can add / view Course
- User can edit Course
    - User can edit Course's Faculty 
        (Faculty options belong to Course's current Department's Faculties)
- User can remove Course
    - Assignment is depending on Course
    - before User can remove Course, system displays all possible dependencies
    - when User execute remove Course action, system safely remove first
        all possible dependencies and finally remove Course itself
** exceptions handling

---> [Assignment] (Role - Admin)
- User can add Assignment
    - User can Upload Assignment File along with other necessary details
- User can view Assignment
    - User can Search / Filter Assignment by Department and/or Faculty
    - User can Download Assignment File
** exceptions handling

---> [Student]-[Course]-[Assignment] Relationship
	---> [Student]-[Course]
		- [StdToCourse]
		- (Student)1------->0-*(Course)
		- (Course)1------->0-*(Student)

	---> [Student]-[Assignment]
		- [StdToAsmt]
		- (Student)1------->0-*(Assignment)
		- (Assignment)1------->0-*(Student)
    		//0 - AsmtLinked, // when Course and it's Assignment is linked to Student
    		//1 -  AsmtNotLinked, // when Course is linked but it's Assignment is not linked to Student     
    		//2 -  AsmtSubmitted // when Course and Assignment are linked and Assignment is submitted by Student
    		// in db table [StdToAsmt], (AsmtLinkStatus) is either 0 or 2

		- Student can have Assignment(s) only belong to the assigned Courses to the Student
			means... Assignments depend on Course and Courses are assigned to Student
		- [StdToAsmt] table maintains records for (Downloaded Assignments(AsmtLinkStatus=0)) and 
			(Downloaded Assignments but later Course is dropped by this Student(AsmtLinkStatus=0)) and
			(Downloaded Assignments and Assignments are submitted by this Student (AsmtLinkStatus=2))

---> [Student] (Role - Admin)
- User can add / edit / view Student
- User can remove Student
    - Student-Course and Student-Assignment are depending on Student
    - before User can remove Student, system displays all possible dependencies
    - when user execute remove Student action, system safely remove first
        all possible dependencies and finally remove Student itself
** exceptions handling

---> [Student]-[Course] = [StdsToCourses] (Role - Admin)
- User can view / add / remove Course(s) assigned to selected Student
** exceptions handling

---> [Student]-[Course]-[Assignment] = [StdsToCourses]-[StdToAsmt] (Role - Student)
- User can view assigned Course(s) information like Course and Faculty info
- User can view Assignments only for assigned Courses
- User can Download Assignment and Submit Assignment
- User can not Submit Assignment before Download it first
- after Downloaded and Submitted Assignments, user can not Re-Submit Assignment
** exceptions handling
