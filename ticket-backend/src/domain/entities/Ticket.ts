export class Ticket {
    constructor(
        public readonly id: number,
        public title: string,
        public description: string,
        public priority: string,
        public status: string,
        public category: string,
        public readonly userId: number,
        public assignedAgentId?: number | null,
        public readonly createdAt?: Date,
        public updatedAt?: Date | null,
        public imageUrl?: string | null
    ) {}
}
