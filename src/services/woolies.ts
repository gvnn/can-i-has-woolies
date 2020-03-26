import config from "config";
import http from "../utils/http";
import { GaxiosResponse } from "gaxios";

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

export const timeSlots = async (
  addressConfig: Address
): Promise<GaxiosResponse<Timeslot[]>> =>
  http.request<Timeslot[]>({
    url: config.get("api.timeslots"),
    params: {
      addressId: addressConfig.AddressId,
      areaId: addressConfig.AreaId,
      fulfilmentMethod: "Courier",
      getMergedResults: false,
      suburbId: addressConfig.SuburbId,
    },
  });

export const findAddress = async (
  Search: string
): Promise<
  GaxiosResponse<{
    Response: AddressSearch[];
  }>
> =>
  http.request<{ Response: AddressSearch[] }>({
    url: config.get("api.address"),
    method: "POST",
    data: {
      Search,
    },
  });

export const identifyAddress = async (selectedOption: {
  AddressId: string;
}): Promise<
  GaxiosResponse<{
    Address: Address;
  }>
> =>
  http.request<{ Address: Address }>({
    url: config.get("api.auto"),
    method: "POST",
    data: {
      AddressId: selectedOption.AddressId,
    },
  });
