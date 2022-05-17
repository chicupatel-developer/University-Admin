import StdAsmtRemoveVM from "./stdAsmtRemoveVM";
import StdCrsRemoveVM from "./stdCrsRemoveVM";

export default class StdRemoveVM {
    departmentId: number;
    departmentName: string;
    errorCode: number;
    errorMessage: string;
    courses: StdCrsRemoveVM[];
    assignments: StdAsmtRemoveVM[];
}
