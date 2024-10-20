import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { OutfitPlan, OutfitPlanInput } from "../entities/OutfitPlan";
import { IContext } from "./Users";
import datasource from "../utils";

@Resolver()
export class OutfitsPlansResolver {

    @Authorized()
    @Mutation(() => OutfitPlan)
    async createOutfitPlan(
        @Arg("data", () => OutfitPlanInput) data: OutfitPlanInput,
        @Ctx() context: IContext
    ) : Promise<OutfitPlan> {
        return await datasource.getRepository(OutfitPlan).save({...data, userId: context.user.id});    
    }

    @Authorized()
    @Mutation(() => OutfitPlan)
    async updateOutfitPlan(
        @Arg("id") id: number,
        @Arg("data", () => OutfitPlanInput) data: OutfitPlanInput
    ) : Promise<OutfitPlan> {
        const outfitPlan = await datasource.getRepository(OutfitPlan).findOne({ where: { id } });
        return await datasource.getRepository(OutfitPlan).save({ ...outfitPlan, ...data, updated_at: new Date() });
    }

    @Authorized()
    @Mutation(() => Boolean)
    async deleteOutfitPlan(
        @Arg("id") id: number
    ) : Promise<boolean> {
        const outfitPlan = await datasource.getRepository(OutfitPlan).findOne({ where: { id } });
        if (!outfitPlan) {
            return false;
        }
        await datasource.getRepository(OutfitPlan).delete({ id });
        return true;
    }

    @Authorized()
    @Query(() => [OutfitPlan])
    async outfitPlans(
        @Ctx() context: IContext
    ) : Promise<OutfitPlan[]> {
        return await datasource.getRepository(OutfitPlan).find({ where: { userId: context.user.id } });
    }

    @Authorized()
    @Query(() => OutfitPlan)
    async outfitPlan(
        @Arg("id") id: number
    ) : Promise<OutfitPlan> {
        return await datasource.getRepository(OutfitPlan).findOne({ where: { id } });
    }
}