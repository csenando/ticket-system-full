export interface Ticket {
    id: number;
    title: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    createdAt: string;
    updatedAt: string;
}
