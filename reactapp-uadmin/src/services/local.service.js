export function getRoles() {
  return [{ name: "Admin" }, { name: "Student" }];
}

export function getGender(genderCode) {
  if (genderCode === 0) return "Male";
  if (genderCode === 1) return "Female";
}
export function getGenderStyle(genderCode) {
  if (genderCode === 0) return "blue";
  if (genderCode === 1) return "red";
}
