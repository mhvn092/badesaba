import { Observable } from 'rxjs';

export interface GetAvailabilityRequestInterface {
  bookIds: string[];
}

export interface ReduceAvailibilityRequestInterface {
  bookId: string;
  quantity: number;
}

export interface ReduceAvailibilityResponseInterface {
  status:boolean
}


export interface GetAvailabilityResponseInterface {
  avalability: number;
  price: number;
  bookId: string;
  name: string;
}

export interface ProductServiceInterface {
  GetAvailability: (
    body: GetAvailabilityRequestInterface
  ) => Observable<GetAvailabilityResponseInterface[]>;

  ReduceAvailability: (
    body: ReduceAvailibilityRequestInterface[]
  ) => Observable<ReduceAvailibilityResponseInterface>;
}
