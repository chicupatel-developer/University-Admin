# DotNet Core + Angular + React

Server side technology: .net core web api, ef core- code first, sql server, repository pattern, custom jwt authentication, google oauth2 authentication


client side technology: angular, react, html, css, javascript, bootstrap


db tables: departments, faculties, courses, assignments, asmtUploads (assignment upload), students, stdstocourses, stdtoasmt


/////////////// system info

//// between department-faculty-course
// course can not exist without department and faculty
// one course can connect with one department and one faculty
// department has multiple courses and faculties
// faculty can have multiple or zero course(s)
// faculty can not exist without department
// department - faculty - course
// sequence...
// first create department
// second create faculty... faculty needs only department
// third create course... course needs both department and faculty

** exceptions handling: 
- model validations are handled on client side - angular - controller 
- all server side exceptions are handled on api - controller
- all file upload/download related exceptions are handled on api/controller and angular/controller

//// role based authentication
- JWT authentication
- sign-in using google authentication and custom jwt authentication
- either Student or Admin role is created during registration
- after successful sign-in, respective role is returned in token / response
- angular stores role info with token
- header menu component displays related menu options as per role info
- when user bypasses header menu options and directly types url then, on server side
api's controller code checks with [Authorize("Admin")] and if un-authorised then,
returns 403 (Forbidden)
- on angular side auth.interceptor.ts file catches 403 and, redirects to home page
else if (err.status == 403){
                            // not authorise
                            // redirect to home page
                            this.router.navigateByUrl('/home');
                        }

//// sign-in
- user can sign-in
- after successful sign-in, token, role and other user's information is stored
on client side and menu options are displayed as per user's role
- after un-successful sign-in, error message is displayed
** exceptions handling

//// registration
- user can be either Admin or Student
- @ Registration process, Admin - role profile is created.
- for Student - role, first need to create student @ Student db table__
- and then after @ Registration process, select Student - role and __
- map already created student with Student - role profile.
- after un-successful registration, error message is displayed
** exceptions handling

//// department (role - Admin)
- user can add / edit / view department
- user can remove department
    - faculty, course and assignment are depending on department
    - before user can remove department, system displays all possible dependencies
    - when user execute remove department action, system safely remove first
        all possible dependencies and finally remove department itself
** exceptions handling

//// faculty (role - Admin)
- user can add / edit / view faculty
- user can remove faculty
    - course and assignment are depending on faculty
    - before user can remove faculty, system displays all possible dependencies
    - when user execute remove faculty action, system safely remove first
        all possible dependencies and finally remove faculty itself
** exceptions handling

//// course (role - Admin)
- user can add / view course
- user can edit course
    - user can edit course's faculty 
        (faculty options belong to course's current department's faculties)
- user can remove course
    - assignment is depending on course
    - before user can remove course, system displays all possible dependencies
    - when user execute remove course action, system safely remove first
        all possible dependencies and finally remove course itself
** exceptions handling

//// assignment (role - Admin)
- user can add assignment
    - user can upload assignment file along with other necessary details
- user can view assignment
    - user can search / filter assignment by department and/or faculty
    - user can download assignment file
** exceptions handling

//// student - course - assignment
// student-course
- StdToCourse 
- (student)1------->0-*(course)
- (course)1------->0-*(student)

// student-assignment
    //0 - AsmtLinked, // when course and it's asmt is linked to student
    //1 -  AsmtNotLinked, // when course is linked but it's asmt is not linked to student     
    //2 -  AsmtSubmitted // when course and asmt are linked and asmt is submitted by student
    // in db table StdToAsmt, status is either 0 or 2
- (student)1------->0-*(asmt)
- (asmt)1------->0-*(student)
student can have assignments only belong to the assigned courses to the student.
means... assignments depend on course and courses are assigned to student.
- StdToAsmt
this table maintains records only for (downloaded assignments(AsmtLinkStatus=0)) and 
(downloaded assignments but later course is dropped by this student(AsmtLinkStatus=0)) and
(downloaded assignments and assignments are submitted by this student (AsmtLinkStatus=2))

//// student (role - Admin)
- user can add / edit / view student
// wip
- user can remove student
    - aspnetusers[AuthenticationDB], student-course and student-assignment are depending on student
    - before user can remove student, system displays all possible dependencies
    - when user execute remove student action, system safely remove first
        all possible dependencies and finally remove student itself
** exceptions handling

//// student-course(StdsToCourses) (role - Admin)
- user can view / add / remove course(s) assigned to selected student

//// student-course-assignment(StdsToCourses-StdToAsmt) (role - Student)
- user can view assigned course(s) information like course and faculty info
- user can view assignments only for assigned courses
- user can download assignment and submit assignment
- user can not submit assignment before download it first
- after downloaded and submitted assignments, user can not re-submit assignment




