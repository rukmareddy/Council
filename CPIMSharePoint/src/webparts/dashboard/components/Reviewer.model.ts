export class Reviewer{
    id?: string;       
   title?: string;
   firstName?: string;
   lastName?: string;
   email?: string;
constructor(result:any){
    this.id=result.ID;       
    this.title= result.AssignedTo.Title;
    // this.firstName= result.AssginedTo.FirstName;
    // this.lastName= result.LastName;
    this.email=result.AssignedTo.Email;
}
}