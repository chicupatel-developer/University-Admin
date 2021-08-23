# University-API-Angular

# DotNet Core + Angular

Technology
----------
- .Net Core Web API

- EF Core - code first - EF Transaction

- Repository pattern

- Sql Server

- Custom JWT Authentication

- Google oauth2 Authentication

- Angular, Html, CSS, Javascript, Bootstrap

DB Tables
---------
    [departments]
    [faculties]
    [courses]
    [assignments]
    [asmtUploads] (assignment upload)
    [students]
    [stdstocourses] (students to courses)
    [stdtoasmt] (students to assignments)    
    - db context: UniversityContext.cs

DB Tables
--------- 
    [AspNetUsers] (all Users (Admin/Student))
    [AspNetRoles] (Admin/Student - Roles)
    [AspNetUserLogins] (external(google) - signin)
    - db context: ApplicationDbContext.cs

DB Tables Relationship
----------------------
---> [Department]-[Faculty]-[Course]
          
	- [Department]-[Faculty]
		- (Department)1------->0-*(Faculty)
		- (Faculty)1------->1(Department)
	- [Department]-[Course]
		- (Department)1------->0-*(Course)
		- (Course)1------->1(Department)
	- [Faculty]-[Course]
		- (Faculty)1------->0-*(Course)
		- (Course)1------->1(Faculty)	


---> [Assignment]-[Faculty]-[Course] 

	- [Assignment]-[Faculty]
		- (Assignment)1------->1(Faculty)
		- (Faculty)1------->0-*(Assignment)
	- [Assignment]-[Course]
		- (Assignment)1------->1(Course)
		- (Course)1------->0-*(Assignment)

---> [Student]-[Course]-[Assignment] 

	- Student can have Assignment(s) only belong to the assigned Courses to the Student
			means... Assignments depend on Course and Courses are assigned to Student		
	- [Student]-[Course]
		- [StdsToCourses]
		- (Student)1------->0-*(Course)
		- (Course)1------->0-*(Student)
	- [Student]-[Assignment]
		- [StdToAsmt]
		- (Student)1------->0-*(Assignment)
		- (Assignment)1------->0-*(Student)

---> exceptions handling

	  - Model validations are handled on Client side - Angular - Component
	  - all Server side exceptions are handled on Api - Controller / C# Service
	  - all File Upload/Download related exceptions are handled on Api/Controller and Angular/Component


---> [Role based Authentication]

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
		
---> [Signin]

	- User can sign-in
	- after successful sign-in, Token, Role and other User's information is stored
		on Client side and menu options are displayed as per User's Role and redirects to Home page
	- after un-successful sign-in, error message is displayed 
	- exceptions handling


---> [Registration]

	- User can be either Admin or Student
	- @ Registration process, Admin - role profile is created
	- for Student - Role, first need to create Student @ Student db table__ and then after @ Registration process, 
     select Student - Role and __ map already created Student with Student - Role profile
	- after un-successful Registration, error message is displayed___ after successful Registration, redirects to Signin page 
	- exceptions handling


---> [Department] ADMIN : Role

	- User can add / edit / view Department
	- User can remove Department
	- Faculty, Course and Assignment are depending on Department
	- before User can remove Department, system displays all possible dependencies
	- when User execute remove Department action, system safely remove first
        	all possible dependencies and finally remove Department itself 
	- after un-successful operation, error message is displayed
	- after successful operation, redirects to it's main respective Component page
	- exceptions handling


---> [Faculty] ADMIN : Role

	- User can add / edit / view Faculty
	- User can remove Faculty
	- Course and Assignment are depending on Faculty
	- before User can remove Faculty, system displays all possible dependencies
	- when User execute remove Faculty action, system safely remove first
        	all possible dependencies and finally remove Faculty itself
	- after un-successful operation, error message is displayed
	- after successful operation, redirects to it's main respective Component page
	- exceptions handling


---> [Course] ADMIN : Role

	- User can add / view Course
	- User can edit Course	
	- User can edit Course's Faculty
		(Faculty options belong to Course's current Department's Faculties)
	- User can remove Course
	- Assignment is depending on Course
	- before User can remove Course, system displays all possible dependencies
	- when User execute remove Course action, system safely remove first
        	all possible dependencies and finally remove Course itself
	- after un-successful operation, error message is displayed
	- after successful operation, redirects to it's main respective Component page
	- exceptions handling


---> [Assignment] ADMIN : Role

	- User can add Assignment
	- User can Upload Assignment File along with other necessary details	
	- User can view Assignment
	- User can Search / Filter Assignment by Department and/or Faculty
	- User can Download Assignment File
	- after un-successful operation, error message is displayed
	- after successful operation, redirects to it's main respective Component page
	- exceptions handling


---> [Student] ADMIN : Role

	- User can add / edit / view Student
	- User can remove Student	
	- Student-Course and Student-Assignment are depending on Student
	- before User can remove Student, system displays all possible dependencies
	- when user execute remove Student action, system safely remove first
		all possible dependencies and finally remove Student itself
	- after un-successful operation, error message is displayed
	- after successful operation, redirects to it's main respective Component page
	- exceptions handling  
  

---> [Student]-[Course] = [StdsToCourses] ADMIN : Role

	- User can view / add / remove Course(s) assigned to selected Student
	- after un-successful operation, error message is displayed
	- after successful operation, redirects to it's main respective Component page
	- exceptions handling  
  
  
---> [Student]-[Course]-[Assignment] = [StdsToCourses]-[StdToAsmt] STUDENT : Role

	- User can view assigned Course(s) information like Course and Faculty info
	- User can view Assignments only for assigned Courses
	- User can Download Assignment and Submit Assignment
	- User can not Submit Assignment before Download it first
	- after Downloaded and Submitted Assignments, user can not Re-Submit Assignment
	- exceptions handling



SCREEN___S

Home

![Home1](https://user-images.githubusercontent.com/26190114/130487955-3b907fc2-4657-4dd8-981a-64c1d2169c6a.PNG)


![Home2](https://user-images.githubusercontent.com/26190114/130488070-2230b481-c628-4ae5-9f83-ba88ab7cc939.PNG)


Login

![Login](https://user-images.githubusercontent.com/26190114/130488116-deeb9157-eddb-498e-b2f8-5c31d5145392.PNG)


![Login Success](https://user-images.githubusercontent.com/26190114/130488136-2f2ed1c2-b6ea-4493-adad-257bc1cbc8ef.PNG)


![Google Login Success](https://user-images.githubusercontent.com/26190114/130488160-fdfcdcaa-ba54-42ed-86f0-2df513987da8.PNG)


Registration

![Registration_Admin_Role](https://user-images.githubusercontent.com/26190114/130489128-e4f9bc2d-c4f2-435f-90a6-67ee687316a7.PNG)


![Registration_Student_Role](https://user-images.githubusercontent.com/26190114/130489131-a8022af3-ea94-4c9a-8ae8-ea9e1ab95088.PNG)


Department (ADMIN: ROLE)

![Department](https://user-images.githubusercontent.com/26190114/130488215-14339bb9-594f-402b-8730-77aea32f43a5.PNG)


![Department_Add](https://user-images.githubusercontent.com/26190114/130488238-e40b2a6e-9519-4af0-bbdf-ba9120f6630d.PNG)


![Department_Edit](https://user-images.githubusercontent.com/26190114/130488280-de007fe0-159b-402a-b16c-97bae85f33da.PNG)


![Department_Remove_Normal](https://user-images.githubusercontent.com/26190114/130488475-f0155fcc-3ab7-4df6-a60f-a8391d5d7412.PNG)


![Department_Remove_Force](https://user-images.githubusercontent.com/26190114/130488484-3b82f066-125d-44bb-a163-8a0eb73738bc.PNG)


Faculty  (ADMIN: ROLE)

![Faculty](https://user-images.githubusercontent.com/26190114/130488527-61193b2f-b584-49ac-872a-da8f384c923e.PNG)


![Faculty_Add](https://user-images.githubusercontent.com/26190114/130488569-5963d4f9-0693-4df9-b071-0c991c7b33cb.PNG)


![Faculty_Edit](https://user-images.githubusercontent.com/26190114/130488575-58331026-6856-4ba4-b376-31d7573d822b.PNG)


![Faculty_Remove_Normal](https://user-images.githubusercontent.com/26190114/130488618-45e95e0e-54bf-4beb-a750-2208ad19958a.PNG)


![Faculty_Remove_Force](https://user-images.githubusercontent.com/26190114/130488631-0e42761f-4444-429b-b514-cf3e932e6939.PNG)


Course  (ADMIN: ROLE)

![Course](https://user-images.githubusercontent.com/26190114/130488685-3f34cd08-26a6-4604-a296-aedf7b339958.PNG)


![Course_Add](https://user-images.githubusercontent.com/26190114/130488699-6a614525-13ac-4ec7-988d-135bf0589910.PNG)


![Course_Edit](https://user-images.githubusercontent.com/26190114/130488720-beb0c688-ba7e-4433-9c18-b02adc9bae2b.PNG)


![Course_Remove_Normal](https://user-images.githubusercontent.com/26190114/130488739-d9796bd7-ac51-47a9-88ba-406f5216198c.PNG)


![Course_Remove_Force](https://user-images.githubusercontent.com/26190114/130488753-3f9742c0-05b4-449f-8dde-fd23be067f88.PNG)


Assignment  (ADMIN: ROLE)

![Assignment_View](https://user-images.githubusercontent.com/26190114/130488833-c13788ba-e545-4c33-a3c5-0a7713add9e2.PNG)


![Assignment_Search](https://user-images.githubusercontent.com/26190114/130488842-a3336b0f-d8e9-447e-b7d3-48b425a035ed.PNG)


![Assignment_Download](https://user-images.githubusercontent.com/26190114/130488895-ba757e1a-bb3f-498e-8d8c-f61e7dee60dc.PNG)


![Assignment_Upload_Add](https://user-images.githubusercontent.com/26190114/130488924-1e7e5c90-9386-4fa1-9ca1-024eda8548d1.PNG)


Student  (ADMIN: ROLE)

![Student_View](https://user-images.githubusercontent.com/26190114/130488963-0416553f-8489-492f-b77c-f290320b85e1.PNG)


![Student_List](https://user-images.githubusercontent.com/26190114/130488979-0d53ec40-85b1-4f20-ad25-b249b24802f7.PNG)


![Student_Add](https://user-images.githubusercontent.com/26190114/130488986-62ffb39e-5fbb-48a6-a2bd-4721b78270f5.PNG)


![Student_Edit](https://user-images.githubusercontent.com/26190114/130488996-794ede44-9600-4e08-bb05-6d8b1161aedf.PNG)


![Student_To_Course_Map](https://user-images.githubusercontent.com/26190114/130489005-794be632-171d-4148-9ade-2cd44d86e795.PNG)


![Student_Remove_Normal](https://user-images.githubusercontent.com/26190114/130489210-8e969f09-ba6e-4116-a569-1494d02c088d.PNG)


![Student_Remove_Force](https://user-images.githubusercontent.com/26190114/130489214-83e80466-e178-4a29-9250-5be75af4cd43.PNG)


Student-Course-Assignment  (STUDENT: ROLE)

![Student_MyCourses_View](https://user-images.githubusercontent.com/26190114/130489419-f249449d-ae7a-4bdf-a2cc-5fd054e4fb00.PNG)


![Student_MyAssignments_View](https://user-images.githubusercontent.com/26190114/130489426-ab005e93-317c-4caf-9d8f-2f3e8e540b26.PNG)


![Student_MyAssignments_Download](https://user-images.githubusercontent.com/26190114/130489473-e29b596f-aaf0-4630-af8d-b9d29e38f5dd.PNG)


![Student_MyAssignments_Download_Linked](https://user-images.githubusercontent.com/26190114/130489487-4ec2bc56-befb-40af-9a30-989fd722adc8.PNG)


![Student_MyAssignments_Submit](https://user-images.githubusercontent.com/26190114/130489516-5e67e679-b25f-4595-ae49-2ecf46d664d4.PNG)


![Student_MyAssignments_Submit_Submitted](https://user-images.githubusercontent.com/26190114/130489584-d27d5056-0186-4fa5-ae56-87c8efb567ee.PNG)

