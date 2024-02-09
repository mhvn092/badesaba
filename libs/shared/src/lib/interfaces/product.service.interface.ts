import { Observable } from 'rxjs';

export interface GetAvailabilityRequestInterface {
  bookIds: string[];
}

export interface ReduceAvailibilityRequestInterface {
  bookId: string;
  quantity: number;
}

export interface ReduceAvailibilityResponseInterface {
  status: boolean
}


export interface GetAvailabilityResponseItemInterface {
  availability: number;
  price: number;
  bookId: string;
  name: string;
}

export interface GetAvailabilityResponseInterface {
  response: GetAvailabilityResponseItemInterface[]
}
export interface ProductServiceInterface {
  GetAvailability: (
    body: GetAvailabilityRequestInterface
  ) => Observable<GetAvailabilityResponseInterface>;

  ReduceAvailability: (
    body: ReduceAvailibilityRequestInterface[]
  ) => Observable<ReduceAvailibilityResponseInterface>;
}
