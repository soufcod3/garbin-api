import { Garment, GarmentInput } from '../entities/Garment';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import datasource from "../utils";
import { IContext } from './Users';

@Resolver()
export class GarmentsResolver {

    @Authorized()
    @Mutation(() => Garment)
    async createGarment(
        @Arg("data", () => GarmentInput) data: GarmentInput,
        @Ctx() context: IContext
    ) : Promise<Garment> {
        return await datasource.getRepository(Garment).save({...data, userId: context.user.id});
    }

    @Authorized()
    @Mutation(() => Garment)
    async updateGarment(
        @Arg("id") id: number,
        @Arg("data", () => GarmentInput) data: GarmentInput
    ) : Promise<Garment> {
        const garment = await datasource.getRepository(Garment).findOne({ where: { id } });
        return await datasource.getRepository(Garment).save({ ...garment, ...data, updated_at: new Date() });
    }

    // type promise of boolean or object with error
    @Authorized()
    @Mutation(() => Boolean)
    async deleteGarment(
        @Arg("id") id: number
    ) : Promise<boolean> {
        const garment = await datasource.getRepository(Garment).findOne({ where: { id } });
        if (!garment) {
            return false;
        }
        await datasource.getRepository(Garment).delete({ id });
        return true;
    }

    @Authorized()
    @Query(() => [Garment])
    async garments(
        @Arg("category", { nullable: true }) category: string
    ) : Promise<Garment[]> {
        if (category) {
            return await datasource.getRepository(Garment).find({ where: { category } });
        }
        return await datasource.getRepository(Garment).find();
    }

    @Authorized()
    @Query(() => Garment)
    async garment(
        @Arg("id") id: number
    ) : Promise<Garment> {
        return await datasource.getRepository(Garment).findOne({ where: { id } });
    }

}