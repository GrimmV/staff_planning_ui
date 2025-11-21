export interface Employee {
	id: string;
	name: string;
	availability: number[];
	available_until: string;
	cl_experience: object;
	short_term_cl_experience: object;
	school_experience: object;
	hasCar: boolean;
	qualifications: string[];
	timeToSchool: object;
	sex: string;
}

export interface Client {
	id: string;
	name: string;
	available_until: string;
	neededQualifications: string[];
	priority: number;
	requiredSex: string;
	school: string;
	timeWindow: number[];
}

export interface IdAssignment {
	ma: string;
	klient: string;
}

export interface Assignment {
	ma: string;
	klient: string;
	abnormality_score: number;
	cl_experience: number;
	school_experience: number;
	short_term_cl_experience: number;
	timeToSchool: number;
	priority: number;
	availability_gap: number;
	geschlecht_relevant: boolean;
	mobility: boolean;
	qualifications_met: boolean;
}

export interface AssignmentContext {
	availability_gap: number;
	cl_experience: number;
	priority: number;
	school_experience: number;
	short_term_cl_experience: number;
	timeToSchool: number;
}

export interface UnassignedClient {
	id: string;
	unreachable: boolean;
}

export interface UnassignedEmployee {
	id: string;
	unreachable: boolean;
}

export interface AssignmentInfo {
	assigned_pairs: Assignment[];
	context: AssignmentContext;
	unassigned_clients: UnassignedClient[];
	unassigned_employees: UnassignedEmployee[];
}

export interface ApiResponse {
	assignment_info: AssignmentInfo;
	clients: Client[];
	mas: Employee[];
}

export interface HardConstraint {
	forced_employees: string[];
	forced_clients: string[];
	banned_assignments: IdAssignment[];
	forced_assignments: IdAssignment[];
}