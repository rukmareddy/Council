export class COI{
    id?: string;       
   title?: string;
   firstName?: string;
   lastName?: string;
   email?: string;
   reviewerId?:string;
   grantNumber?:string;
constructor(result:any){
    this.id=result.ID;       
    this.title= result.Reviewer.Title;
    // this.firstName= result.AssginedTo.FirstName;
    // this.lastName= result.LastName;
    this.email=result.Reviewer.EMail;
this.reviewerId= result.Reviewer.ID;
this.grantNumber = result.GrantNumber;
}
}