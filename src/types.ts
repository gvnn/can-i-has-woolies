export interface TimeslotTime {
  Status: string;
  NormalAllocationStatus: string;
  TimeWindow: string;
  Available: boolean;
  TimeSlotStatus: string;
  StartDateTime: string;
}

export interface Timeslot {
  Times: TimeslotTime[];
  Date: string;
}

export interface AddressSearch {
  Id: string;
  Text: string;
  Postcode: string;
}

export interface Address {
  AddressId: number;
  AddressText: string;
  IsPrimary: boolean;
  PostalCode: string;
  Street1: string;
  Street2: string;
  SuburbId: number;
  SuburbName: string;
  IsPartner: boolean;
  AreaId: number;
  State: string;
}
