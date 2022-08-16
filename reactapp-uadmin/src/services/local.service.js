export function getRoles() {
  return [{ name: "Admin" }, { name: "Student" }];
}

export function getGender(genderCode) {
  if (genderCode === 0) return "Male";
  if (genderCode === 1) return "Female";
  if (genderCode === 2) return "Other";
}
export function getGenderStyle(genderCode) {
  if (genderCode === 0) return "blue";
  if (genderCode === 1) return "red";
  if (genderCode === 2) return "green";
}

export function convertAsmtStatus(statusCode) {
  if (statusCode === 0) return "Assignment Linked";
  if (statusCode === 1) return "Assignment Not Linked";
  if (statusCode === 2) return "Assignment Submitted";
}
export function getAsmtStatusClass(statusCode) {
  if (statusCode === 0) return "asmtLinked";
  if (statusCode === 1) return "asmtNotLinked";
  if (statusCode === 2) return "asmtSubmitted";
}
