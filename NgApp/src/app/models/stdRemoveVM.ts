import StdAsmtRemoveVM from "./stdAsmtRemoveVM";
import StdCrsRemoveVM from "./stdCrsRemoveVM";

export default class StdRemoveVM {
    studentId: number;
    studentName: string;
    errorCode: number;
    errorMessage: string;
    courses: StdCrsRemoveVM[];
    assignments: StdAsmtRemoveVM[];
}
