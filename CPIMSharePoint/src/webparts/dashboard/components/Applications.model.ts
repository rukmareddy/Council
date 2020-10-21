import { Reviewer } from './Reviewer.model'
import{COI} from'../../council/components/COI.model';
import{ApplicationReview} from '../../council/components/ApplicationReviews.model'
export class Application{
         id?: string;       
        title?: string;
        grantNumber?: string;
        FY?: string;
        activityCodeId?: string;
        activityCode?: string;
        awardedAmount?: number;
        description?: string;
        grantStatus?: string;
        grantStatusId?: string;
        requestedAmount?: number;
        adminOrg?: string;
        applicationId?: string;
        PIName?: string;
        percentile?: string;
        priorityScore?: string;
        coi:COI[] =[];
        reviews:ApplicationReview[]=[];
      coiString:string='';
      reviewString:string=''
        constructor(request: any,reviews:ApplicationReview[],COI:COI[] ) {
          this.id = request.Id;
          this.grantNumber = request.GrantNumber;
          this.title = request.Title;
          this.FY = request.FY;
          this.activityCodeId = request.ActivityCodeId;
          this.activityCode = (request.ActivityCodeId) ?GrantStatusEnum[request.ActivityCodeId] :'';;
          this.awardedAmount = request.AwardedAmount; 
          this.description= request.Description;
          this.grantStatus=(request.GrantStatusId) ?GrantStatusEnum[request.GrantStatusId] :'';
          this.grantStatusId= request.GrantStatusId;
          this.requestedAmount= request.RequestedAmount;
          this.adminOrg= request.AdminOrg;
          this.applicationId= request.ApplicationId;
          this.PIName= request.PIName;
          this.percentile= request.Percentile;
          this.priorityScore= request.PriorityScore;
          if(reviews){
            reviews.forEach(element => {
              if(element.grantNumber == request.GrantNumber){
                this.reviews.push(element)
              }
            });
            // this.reviews = reviews.filter(item=> item.grantNumber == request.GrantNumber) as ApplicationReview[]
          }else{
            this.reviews =[];
          }
          if(COI){
            COI.forEach(element => {
              if(element.grantNumber == request.GrantNumber){
                this.coiString = this.coiString+ element.title+"; "
                this.coi.push(element)
              }
            });
          }else{
            this.coi =[];
          }
        }
      
      }
      export enum GrantStatusEnum {
        'Initial Application'	=	1,
        'To Be Reviewed By Council'	=	2,
        Awarded	=	3,
        Closed	=	4,
       'Not Awarded'	=	5,
        'Need More Info'	=	6
        
      }
      export enum ActivityTypeEnum {
        R001	=	1	,
        R02	=	2	,
        AAA	=	3	,
        C01	=	4	,
        D43	=	5	,
        DP1	=	6	,
        DP2	=	7	,
        DP5	=	8	,
        F05	=	9	,
        F30	=	10	,
        F31	=	11	,
        F32	=	12	,
        F33	=	13	,
        F99	=	14	,
        IAA	=	15	,
        K00	=	16	,
        K01	=	17	,
        K02	=	18	,
        K04	=	19	,
        K06	=	20	,
        K08	=	21	,
        K12	=	22	,
        K18	=	23	,
        K22	=	24	,
        K23	=	25	,
        K24	=	26	,
        K25	=	27	,
        K30	=	28	,
        K43	=	29	,
        K99	=	30	,
        L01	=	31	,
        L02	=	32	,
        L03	=	33	,
        L04	=	34	,
        L30	=	35	,
        L40	=	36	,
        N01	=	37	,
        N02	=	38	,
        N43	=	39	,
        N44	=	40	,
        OT2	=	41	,
        P01	=	42	,
        P20	=	43	,
        P2C	=	44	,
        P30	=	45	,
        P40	=	46	,
        P41	=	47	,
        P50	=	48	,
        PL1	=	49	,
        R00	=	50	,
        R01	=	51	,
        R03	=	52	,
        R13	=	53	,
        R15	=	54	,
        R21	=	55	,
        R24	=	56	,
        R25	=	57	,
        R29	=	58	,
        R33	=	59	,
        R34	=	60	,
        R35	=	61	,
        R37	=	62	,
        R41	=	63	,
        R42	=	64	,
        R43	=	65	,
        R44	=	66	,
        R55	=	67	,
        R56	=	68	,
        R61	=	69	,
        R90	=	70	,
        RC1	=	71	,
        RC2	=	72	,
        RC3	=	73	,
        RC4	=	74	,
        RF1	=	75	,
        RL1	=	76	,
        RM1	=	77	,
        RM2	=	78	,
        S03	=	79	,
        S06	=	80	,
        S07	=	81	,
        S10	=	82	,
        S11	=	83	,
        S15	=	84	,
        SB1	=	85	,
        SC1	=	86	,
        SC2	=	87	,
        SI2	=	88	,
        T10	=	89	,
        T15	=	90	,
        T32	=	91	,
        T35	=	92	,
        T36	=	93	,
        T90	=	94	,
        U01	=	95	,
        U09	=	96	,
        U10	=	97	,
        U13	=	98	,
        U18	=	99	,
        U19	=	100	,
        U24	=	101	,
        U2C	=	102	,
        U2R	=	103	,
        U42	=	104	,
        U44	=	105	,
        U54	=	106	,
        UF1	=	107	,
        UG1	=	108	,
        UG3	=	109	,
        UH2	=	110	,
        UH3	=	111	,
        UM1	=	112	,
        X01	=	113	,
        Y01	=	114	,
        Y02	=	115	,
        Y03	=	116	,
        Z01	=	117	,
        
      }
      