/*
  © 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
  ROCKET SOFTWARE, INC. CONFIDENTIAL
*/

export const metadata = {
  columnMetaData: [
    {
      columnIdentifier:'firstname',
      longColumnLabel:'firstname',  
      rawDataType:'string',    
      rawDataTypeLength:'15'
    },
    {
      columnIdentifier:'mi',
      longColumnLabel:'mi',  
      rawDataType:'string',
      columnDescription:"Middle Initial",
      rawDataTypeLength:'1'
    },
    {
      columnIdentifier:'lastname',
      longColumnLabel:'lastname',  
      rawDataType:'string',    
      rawDataTypeLength:'15'
    },
    {
      columnIdentifier:'email',
      longColumnLabel:'email',  
      rawDataType:'string',    
      rawDataTypeLength:'30'
    },
    {
      columnIdentifier:'location',
      longColumnLabel:'location',
      columnDescription: "Department or position in the company",
      rawDataType:'string',    
      rawDataTypeLength:'2'
    },    
    {
      columnIdentifier:'department',
      longColumnLabel:'department',
      columnDescription: "Department or position in the company",
      rawDataType:'string',    
      rawDataTypeLength:'15'
      //defaultSortDirection: "A",
      //sortType: "lexical"
    }
  ],

  tableMetaData: {
    shortTableLabel: "User Directory",
    tableIdentifier: "userDirectory"
  }
};

export enum columns {
  'firstname',
  'mi',
  'lastname',
  'email',
  'location',
  'department'
}


export const rows = [
  ['Kermit','E','Ploof','KermitEPloof@fleckens.hu','NY','Sales'],
  ['Hal','A','Tate','HalATate@armyspy.com','NY','Sales'],
  ['Melanie','J','Jackson','MelanieJJackson@jourrapide.com','NY','Sales'],
  ['Virginia','J','Adams','VirginiaJAdams@armyspy.com','NY','Sales'],
  ['Lidia','P','Ramirez','LidiaPRamirez@dayrep.com','WA','Sales'],
  ['Donald','I','Jackson','DonaldIJackson@dayrep.com','WA','Sales'],
  ['Charles','K','Jones','CharlesKJones@dayrep.com','WA','Sales'],
  ['Clara','B','Lee','ClaraBLee@cuvox.de','WA','Sales'],
  ['Faith','K','Bruns','FaithKBruns@armyspy.com','WA','Sales'],
  ['Eric','J','Nguyen','EricJNguyen@jourrapide.com','WA','Sales'],
  ['Delora','M','Dortch','DeloraMDortch@jourrapide.com','WA','Sales'],
  ['Hazel','M','Yang','HazelMYang@fleckens.hu','NY','Marketing'],
  ['Sammie','R','Russell','SammieRRussell@cuvox.de','NY','Marketing'],
  ['Thomas','L','Wilburn','ThomasLWilburn@cuvox.de','NY','Marketing'],
  ['Jennifer','P','Jones','JenniferPJones@rhyta.com','NY','Marketing'],
  ['Pat','T','Gonzalez','PatTGonzalez@einrot.com','WA','Marketing'],
  ['Rosa','J','Pierce','RosaJPierce@cuvox.de','WA','Marketing'],
  ['Vanda','W','Eagle','VandaWEagle@armyspy.com','WA','Marketing'],
  ['Geraldine','J','Hatch','GeraldineJHatch@fleckens.hu','NY','Management'],
  ['Matthew','J','Garcia','MatthewJGarcia@dayrep.com','NY','Management'],
  ['Dorothy','E','Oster','DorothyEOster@fleckens.hu','NY','Management'],
  ['Virginia','C','Riggins','VirginiaCRiggins@einrot.com','NY','Management'],
  ['Connie','T','Rose','ConnieTRose@einrot.com','WA','Management'],
  ['Gregory','D','Souza','GregoryDSouza@superrito.com','WA','Management'],
  ['Timothy','J','Payne','TimothyJPayne@gustr.com','WA','Management'],
  ['Annie','J','Hertz','AnnieJHertz@dayrep.com','WA','Management'],
  ['John','C','Riley','JohnCRiley@jourrapide.com','NY','Engineering'],
  ['Veronica','R','Stutler','VeronicaRStutler@armyspy.com','NY','Engineering'],
  ['Mary','J','Windsor','MaryJWindsor@gustr.com','NY','Engineering'],
  ['Dawn','J','Bugg','DawnJBugg@teleworm.us','NY','Engineering'],
  ['Mary','D','Douglas','MaryDDouglas@einrot.com','NY','Engineering'],
  ['Harold','L','Quigley','HaroldLQuigley@fleckens.hu','NY','Engineering'],
  ['Heather','D','Coulter','HeatherDCoulter@superrito.com','WA','Engineering'],
  ['Valerie','G','Parker','ValerieGParker@cuvox.de','WA','Engineering'],
  ['Joyce','P','Serrano','JoycePSerrano@superrito.com','WA','Engineering'],
  ['Amber','J','Langenfeld','AmberJLangenfeld@dayrep.com','WA','Engineering'],
  ['Velvet','G','Cook','VelvetGCook@superrito.com','WA','Engineering'],
  ['Aimee','D','Robinson','AimeeDRobinson@dayrep.com','WA','Engineering'],
  ['Edna','V','Coleman','EdnaVColeman@superrito.com','WA','Engineering'],
  ['Angel','M','Rogers','AngelMRogers@rhyta.com','NY','IT'],
  ['Maxine','C','Nance','MaxineCNance@rhyta.com','NY','IT'],
  ['Darryl','F','Cook','DarrylFCook@cuvox.de','NY','IT'],
  ['Fabiola','A','Mastin','FabiolaAMastin@teleworm.us','WA','IT'],
  ['Scott','T','Schenck','ScottTSchenck@rhyta.com','WA','IT']
];

/*
  © 2014-2018 Rocket Software, Inc. or its affiliates. All Rights Reserved.
  ROCKET SOFTWARE, INC. CONFIDENTIAL
*/