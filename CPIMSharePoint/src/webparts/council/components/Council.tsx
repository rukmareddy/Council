import * as React from 'react';
import styles from './Council.module.scss';
import { ICouncilProps } from './ICouncilProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Item, sp, Web } from "@pnp/sp/presets/all";
import "@pnp/sp/profiles";
import {Application} from '../../dashboard/components/Applications.model'
import {Reviewer} from '../../dashboard/components/Reviewer.model'
import{ ApplicationReview} from './ApplicationReviews.model'
import{COI} from './COI.model'
import { ListView, IViewField, SelectionMode } from "@pnp/spfx-controls-react/lib/ListView";
import { ListPicker, ListItemPicker } from "@pnp/spfx-controls-react/lib";
import { DefaultButton, IconButton } from 'office-ui-fabric-react';
 import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
 import { PageContext } from '@microsoft/sp-page-context';
//  import {Application} from './Applications.model';
//  import{ Reviewer} from './Reviewer.model';
// import {
//   SPHttpClient,
//   SPHttpClientResponse
// } from '@microsoft/sp-http';
// import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';

export default class Council extends React.Component<ICouncilProps, any> {
  siteURL="https://brainstormer2020.sharepoint.com/sites/Home/";
  applications:Application[] =[];
  private web = Web(this.siteURL); 
    public constructor(props: ICouncilProps) {
      super(props);
      sp.setup({
        sp: {
          headers: {
            Accept: "application/json;odata=verbose",
          },
          baseUrl: "https://brainstormer2020.sharepoint.com/sites/Home/"
        },
      });
    this.state = {
      spfxContext: this.context,
      applications: [],
      reviwersList: [],
      isAdmin: true
     }
    var _viewFields: IViewField[] = [
      
      {
        name: "",
        displayName: "Vote",
        sorting: false,
        minWidth: 100,
        maxWidth: 125,
        render: (item: any) => {
        return  <div>
                    
          <button className="ms-Button ms-Button--sucess root-82" onClick={this.addReview.bind(this,item.id,item.grantNumber,'true','Test')}>Yes</button>&nbsp;&nbsp;
        <button className="ms-Button ms-Button--error" onClick={this.addReview.bind(this,item.id,item.grantNumber,'false','Test')}>No</button>
                    </div>
            }
      },
      {
        name: "",
        displayName: "Action",
        sorting: false,
        minWidth: 125,
        maxWidth: 175,
        render: (item: any) => {
        return  <div>
        
                     <button className="ms-Button ms-Button--primary root-82" onClick={this._updateApplication.bind(this,item.id,3)}>Award</button>
        <button className="ms-Button ms-Button--primary root-82" onClick={this._updateApplication.bind(this,item.id,5)}>Not Awarded</button>
                  
                    </div>
            }
      },
      {
        name: "",
        displayName: "COI",
        sorting: false,
        minWidth: 125,
        maxWidth: 175,
        render: (item: any) => {
        return  <div>
        
                    <span > {item.coiString}</span>
                
                    </div>
            }
      },
      {
        name: "grantNumber",
        displayName: "Grant#",
        sorting: true,
        maxWidth: 160,
        minWidth: 110

      },
      {
        name: "title",
        displayName: "Project ",
        sorting: true,
        maxWidth: 200,
        minWidth: 150
      },
      
      {
        name: "activityCode",
        displayName: "Activity",
        sorting: true,
        maxWidth: 75,
        minWidth: 50

      },
      {
        name: "PIName",
        displayName: "PI",
        sorting: false,
        maxWidth: 75,
        minWidth: 50

      },
      {
        name: "adminOrg",
        displayName: "ORG",
        sorting: false,
        maxWidth: 75,
        minWidth: 50

      },
      {
        name: "priorityScore",
        displayName: "Score",
        sorting: true,
        maxWidth: 75,
        minWidth: 50

      },
      {
        name: "requestedAmount",
        displayName: "Requested Amount",
        sorting: false,
        minWidth: 100,
        maxWidth: 150
      },
     
      {
        name: "grantStatus",
        displayName: "Status",
        sorting: false,
        minWidth: 100,
        maxWidth: 150
      },
      

    ];
    this.state = { items: [], viewFields: _viewFields };
    this.getApplications();
  }
  public render(): React.ReactElement<ICouncilProps> {
    return (
      <div className="{styles.tabsContainer}">
        <h1>Council Applications for Review</h1>

        <ListView
          items={this.state.items}
          viewFields={this.state.viewFields}
          iconFieldName=""
          compact={false}
          selectionMode={SelectionMode.none}
          selection={this.getApplications}
          showFilter={true}
          filterPlaceHolder="Search..." />
      </div>
    );
  }

  public async componentDidMount(): Promise<void> {
    var reacthandler = this;
    // this.getReviewers();
    // this._updateApplication(8,5);


    return null;

  }
  private async getApplications():Promise<any> {
    let COI : Reviewer[]=[];
    let reviews: Reviewer[]=[];
    await this.getApplicationReviews().then(
      (data) => {
        reviews = data;
      }
    )
    await this.getCOIDetails().then(
      (data) => {
        COI = data;
      }
    )
   return  await fetch(`https://braindatalist.azurewebsites.net/api/GrantApplications?code=ZHv/mXCYNXm84oazAAkAhDEPafrqnC3oBX/fE8a8uZQ07sSAayrsRA==`)
    .then((response) => response.json()) .then((data) => {
      console.log('This is your data', data);
    // this.setState({ items: data });
    let obj:any[]=[];
    data.forEach(element => {
      if(element.GrantStatusId == 2 ){
     let dataObj = new Application( element,reviews,COI)
     obj.push(dataObj)
    }
    });
    console.log(obj);
    this.setState({ items: obj });
    return data;
  });
    // return  this.state._spHttpClient.get(`https://braindatalist.azurewebsites.net/api/GrantApplications?code=ZHv/mXCYNXm84oazAAkAhDEPafrqnC3oBX/fE8a8uZQ07sSAayrsRA==`, SPHttpClient.configurations.v1)
    // .then((response: SPHttpClientResponse) => {
    //   // alert(response);
    //   this.setState({ items: response });

    //   return response.json();
    // });

    //  return this._updateApplication()

  }
  private  _updateApplication(Id:number, Status:number):Promise<any>{
    let body={
      'Id':Id,
      'Status':Status
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
  };
  const postURl = `https://braindatalist.azurewebsites.net/api/UpdateGrantStatus?code=d5dKmH/UfR9Sj7IKVQagWQxYOMlq0gogaMRX0whWGoYNn5/ix7cDRw==`;

  return fetch(postURl, requestOptions)
      // .then(response => response.json())
      .then(data => {
        //this.setState({ postId: data.id })
      alert("Sucess : Record updated");
      this.getApplications();

      return true;
      // }
    });
   

  }

  // private getReviewers(): Promise<any> {
  //   //https://brainstormer2020.sharepoint.com/sites/Home/Lists/Reviewers
  //   // const web =   Web(this.nominationFormURL);
  //   let revieweres: Reviewer[] = [];

  //      return sp.web.lists
  //     .getByTitle("Reviewers")
  //     .items
  //     .expand('AssignedTo')
  //     .select(
  //       `ID, AssignedTo/Title, AssignedTo/ID, AssignedTo/EMail,AssignedTo/UserName`)
  //     .get()
  //     .then(
  //       (results): void => {
  //         results.forEach(element => {
  //           let data = new Reviewer(element);
  //           revieweres.push(data);
  //         });
  //         return revieweres;
  //         this.setState({ reviwersList: revieweres });
  //         //  this.getTaskDetails(results);
  //       },
  //       (error: any): void => {
  //         console.error("Oops error occured", error);
  //       }
  //     );
  // }
  private async getApplicationReviewers():Promise<any> {
    let appReviews: ApplicationReview[]=[]
       return await sp.web.lists
      .getByTitle("ApplicationReviewers")
      .items.get()
      .then(
        (results): any => {
          //  this.getTaskDetails(results);
          results.forEach(element => {
            var data = new ApplicationReview(element);
            appReviews.push(data);
          });
         
          return appReviews;
        },
        (error: any): any => {
          console.error("Oops error occured", error);
          return error;
        }
      );
  }

  private async getApplicationReviews(): Promise<any> {
    let revieweres :ApplicationReview[]=[]
  return await sp.web.lists
   .getByTitle("ApplicationReviews")
   .items
   .expand('Author')
   .select(
     `ID, Author/Title, Author/ID, Author/EMail,Author/UserName, GrantNumber, Vote, Comments,ApplicationId`)
     .get()
   .then(
     (results): any => {
      
         results.forEach(element => {
         let data = new ApplicationReview(element);
         revieweres.push(data);
       });
       return revieweres;
         this.setState({ reviwersList: revieweres })
       //  this.getTaskDetails(results);
       },
       (error: any): void => {
         console.error("Oops error occured", error);
       }
   );
}
private async getCOIDetails(): Promise<any> {
let  coiDetails:COI[]=[];
 return await  sp.web.lists
   .getByTitle("COI")
   .items
   .expand('Reviewer')
   .select(
     `ID, Reviewer/Title, Reviewer/ID, Reviewer/EMail,Reviewer/UserName, GrantNumber`)
   .get()
   .then(
     (results): any => {
      results.forEach(element => {
         var data= new COI(element);
         coiDetails.push(data);
       });
       return coiDetails;
     //  this.getTaskDetails(results);
     },
     (error: any): any => {
       console.error("Oops error occured", error);
       return error;
     }
   );
}
  async addReview(id:number,grant:String,vote:string,comments:string): Promise<void> {
//     const profile = await sp.profiles.myProperties.get();
//     console.log(profile.DisplayName);
// console.log(profile.Email);
// console.log(profile.Title);
    // var email=this.pageContext.user.email;
    let uID = await this.getUserIdByEmail("rukmareddy@BrainStormer2020.onmicrosoft.com")
       sp.web.lists.getByTitle("ApplicationReviews")
      .items.add({
        Title: "null",
        ReviewerId: +uID,
        Vote: vote,
        Comments: comments,
ApplicationId:id,
GrantNumber:grant
      })
      .then(
        (results): void => {
          alert("Your Vote - " +vote+ " to Grant Application " +grant+" Submitted Sycessfully")
        //  this.getTaskDetails(results);
        },
        (error: any): void => {
          console.error("Oops error occured", error);
        }
      );
  }
 
  async getUserIdByEmail(email: string): Promise<any> {
    // const web = new Web(this.siteURL);
    const userId = await this.web
      .ensureUser(email)
      .then(function (user) {
        return user.data.Id;
      })
      .catch(function (error) {
        return -1;
      });

    return userId;
  }
  
}

