import * as React from 'react';
import styles from './Dashboard.module.scss';
import { IDashboardProps } from './IDashboardProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { sp, Web } from "@pnp/sp/presets/all";
import "@pnp/sp/profiles";

import { ListView, IViewField, SelectionMode } from "@pnp/spfx-controls-react/lib/ListView";
import { ListPicker, ListItemPicker } from "@pnp/spfx-controls-react/lib";
import { DefaultButton, IconButton,IContextualMenuProps } from 'office-ui-fabric-react';
 import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
 import { PageContext } from '@microsoft/sp-page-context';
 import {Application} from './Applications.model';
 import{ Reviewer} from './Reviewer.model';
import {
  SPHttpClient,
  SPHttpClientResponse
} from '@microsoft/sp-http';
import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';

export interface IReactGetItemsState {
  
}
const menuProps: any = {
  items: [
    {
      key: 'emailMessage',
      text: 'Email message',
      iconProps: { iconName: 'Mail' },
    },
    {
      key: 'calendarEvent',
      text: 'Calendar event',
      iconProps: { iconName: 'Calendar' },
    },
  ],
};
export default class Dashboard extends React.Component<IDashboardProps, any> {
  siteURL="https://brainstormer2020.sharepoint.com/sites/Home/";
  private web = Web(this.siteURL); 
  private _spHttpClient: SPHttpClient;
  private _httpClient: HttpClient;
  private _iHttpClientOptions: IHttpClientOptions;
    public constructor(props: IDashboardProps) {
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
      
      // {
      //   name: "",
      //   displayName: "Vote",
      //   sorting: false,
      //   minWidth: 100,
      //   maxWidth: 125,
      //   render: (item: any) => {
      //   return  <div>
                    
      //     <button className="ms-Button ms-Button--sucess root-82" onClick={this.addReview.bind(this,item.id,item.grantNumber,'true','Test')}>Yes</button>&nbsp;&nbsp;
      //   <button className="ms-Button ms-Button--error" onClick={this.addReview.bind(this,item.id,item.grantNumber,'false','Test')}>No</button>
      //               </div>
      //       }
      // },
      {
        name: "",
        displayName: "Action",
        sorting: false,
        minWidth: 125,
        maxWidth: 175,
        render: (item: any) => {
        return  <div>
         <DefaultButton
        text="Update Status"
        primary
        split
        splitButtonAriaLabel="Update Status"
        aria-roledescription="split button"
        disabled={false}
        menuProps={{ items: [
          {
            key: '1',
            text: 'New',
            iconProps: { iconName: 'Mail' },
            onClick:this._updateApplication.bind(this,item.id,1)
          },
          {
            key: '2',
            text:      'To Be Reviewed By Council',
            iconProps: { iconName: 'Calendar' },
            onClick:this._updateApplication.bind(this,item.id,2)
          },
          {
            key: '4',
            text: 'Closed',
            iconProps: { iconName: 'Mail' },
            onClick:this._updateApplication.bind(this,item.id,4)
          },
          {
            key: '6',
            text:      'Need More Info',
            iconProps: { iconName: 'Calendar' },
            onClick:this._updateApplication.bind(this,item.id,6)
          },
        ],}}
       
       
      />
                     {/* <button className="ms-Button ms-Button--primary root-82" onClick={this._updateApplication.bind(this,item.id,3)}>Award</button>
        <button className="ms-Button ms-Button--primary root-82" onClick={this._updateApplication.bind(this,item.id,5)}>Not Awarded</button> */}
       
       
       
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
  public render(): React.ReactElement<IDashboardProps> {
    return (
      <div className="{styles.tabsContainer}">
        <h1>Pre-Council Applications for Review</h1>

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
    this.getReviewers();
    // this._updateApplication(8,5);


    return null;

  }
  private getApplications():Promise<any> {
    let COI : Reviewer[]=[];
    let reviwers: Reviewer[]=[];
   return fetch(`https://braindatalist.azurewebsites.net/api/GrantApplications?code=ZHv/mXCYNXm84oazAAkAhDEPafrqnC3oBX/fE8a8uZQ07sSAayrsRA==`)
    .then((response) => response.json()) .then((data) => {
      console.log('This is your data', data);
    // this.setState({ items: data });
    let obj:any[]=[];
    data.forEach(element => {
     let dataObj = new Application( element,reviwers,COI)
     obj.push(dataObj)
    });
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
    // alert("Selected - "+Status+"+" +Id);
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

  private getReviewers(): void {
    //https://brainstormer2020.sharepoint.com/sites/Home/Lists/Reviewers
    // const web =   Web(this.nominationFormURL);
       sp.web.lists
      .getByTitle("Reviewers")
      .items
      .expand('AssignedTo')
      .select(
        `ID, AssignedTo/Title, AssignedTo/ID, AssignedTo/EMail,AssignedTo/UserName`)
        .get()
      .then(
        (results): void => {
        let revieweres :Reviewer[]=[]
          results.forEach(element => {
          let data = new Reviewer(element);
          revieweres.push(data);
        });
          this.setState({ reviwersList: revieweres })
        //  this.getTaskDetails(results);
        },
        (error: any): void => {
          console.error("Oops error occured", error);
        }
      );
  }
  private getApplicationReviews(): void {
       sp.web.lists
      .getByTitle("ApplicationReviews")
      .items
      .expand('Author')
      .select(
        `ID, Author/Title, Author/ID, Author/EMail,Author/UserName, GrantNumber, Vote, Comments,ApplicationId`)
        .get()
      .then(
        (results): void => {
          let revieweres :Reviewer[]=[]
            results.forEach(element => {
            let data = new Reviewer(element);
            revieweres.push(data);
          });
            this.setState({ reviwersList: revieweres })
          //  this.getTaskDetails(results);
          },
          (error: any): void => {
            console.error("Oops error occured", error);
          }
      );
  }
  private getCOIDetails(): void {
       sp.web.lists
      .getByTitle("COI")
      .items
      .expand('Reviewer')
      .select(
        `ID, Reviewer/Title, Reviewer/ID, Reviewer/EMail,Reviewer/UserName, GrantNumber`)
      .get()
      .then(
        (results): void => {
        //  this.getTaskDetails(results);
        },
        (error: any): void => {
          console.error("Oops error occured", error);
        }
      );
  }
  async addReview(id:number,grant:String,vote:string,comments:string): Promise<void> {
//     const profile = await sp.profiles.myProperties.get();
//     console.log(profile.DisplayName);
// console.log(profile.Email);
// console.log(profile.Title);
    // var email=this.pageContext.user.email;
    // let uID = await this.getUserIdByEmail("rukmareddy@BrainStormer2020.onmicrosoft.com")
       sp.web.lists.getByTitle("ApplicationReviews")
      .items.add({
        Title: "null",
        // ReviewerId: +uID,
        Vote: vote,
        Comments: comments,
ApplicationId:id,
GrantNumber:grant
      })
      .then(
        (results): void => {
          alert("Your Vote - " +vote+ " to Grant Application " +grant+" Submitted Successfully")
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
