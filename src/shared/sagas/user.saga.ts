// src/shared/sagas/user.saga.ts
import { Injectable } from '@nestjs/common';
import { Saga, ICommand } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { delay, map } from 'rxjs/operators';
import { ofType } from '@nestjs/cqrs';

@Injectable()
export class UserSaga {
  @Saga()
  userRegistered = (events$: Observable<any>): Observable<ICommand> => {
    return events$.pipe(
      ofType(UserRegisteredEvent),
      delay(1000),
      map((event: UserRegisteredEvent) => {
        console.log(`User with ID ${event.userId} has been registered.`);
        return null;
      }),
    );
  };
}
