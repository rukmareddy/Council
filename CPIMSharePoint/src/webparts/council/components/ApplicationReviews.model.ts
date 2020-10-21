export class ApplicationReview{
        id?: string;       
       title?: string;
       firstName?: string;
       lastName?: string;
       email?: string;
       reviewerId?:string;
       grantNumber?:string;
       vote?:string;
    constructor(result:any){
        this.id=result.ID;       
        this.title= result.Author.Title;
        // this.firstName= result.AssginedTo.FirstName;
        // this.lastName= result.LastName;
        this.email=result.Author.EMail;
    this.reviewerId= result.Author.ID;
    this.grantNumber = result.GrantNumber;
    this.vote= result.Vote;
    }
    }