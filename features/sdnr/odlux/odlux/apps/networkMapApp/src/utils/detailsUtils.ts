import { dataService } from '../services/dataService';
import { DetailsTypes, isLink, isService, isSite } from '../model/topologyTypes';

type DetailsDataUrl = {
  type: string;
  id: string;
} | null;

class DetailsUtils {

  errorCallback: any;

  public setLoadDataError = (callback: (data: any) => void) => {
    this.errorCallback = callback;
  };

  public isLoadNeeded = (detailsData: DetailsDataUrl, currentId: number | undefined, currentData: any) => {

    if (!detailsData)
      return false;

    return (currentId?.toString() !== detailsData.id ||
      detailsData.type == DetailsTypes.site && !isSite(currentData) ||
      detailsData.type == DetailsTypes.link && !isLink(currentData) ||
      detailsData.type == DetailsTypes.service && !isService(currentData)
    );
  };

  public isTypeAllowed = (type: string) => {
    return type == DetailsTypes.site || type == DetailsTypes.link || type == DetailsTypes.service;
  };

  public loadData = (type: string, id: string, callback: (data: any) => void) => {

    dataService.getDetailsData(type, id)
      .then(res => {
        if (res !== null)
          callback(res);
        else
          this.errorCallback(id);
      });
  };

}

const detailsUtils = new DetailsUtils();

export default detailsUtils;