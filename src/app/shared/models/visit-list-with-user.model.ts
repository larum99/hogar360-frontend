import { VisitList } from './visit-list.model';
import { UserSimple } from './user-simple.model';
import { HouseSimple } from './house-simple.model';

export interface VisitListWithUser extends VisitList {
    user?: UserSimple;
    house?: HouseSimple;
}