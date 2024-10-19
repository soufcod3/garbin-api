import { Outfit, OutfitInput } from './../entities/Outfit';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import datasource from "../utils";
import { IContext } from './Users';
import { Garment } from '../entities/Garment';

@Resolver()
export class OutfitsResolver {

    @Authorized()
    @Mutation(() => Outfit)
    async createOutfit(
        @Arg("data", () => OutfitInput) data: OutfitInput,
        @Ctx() context: IContext
    ) : Promise<Outfit> {
            return await datasource.getRepository(Outfit).save({ ...data, userId: context.user.id });
    }

    @Authorized()
    @Mutation(() => Outfit)
    async updateOutfit(
        @Arg("id") id: number,
        @Arg("data", () => OutfitInput) data: OutfitInput
    ) : Promise<Outfit> {
        const outfit = await datasource.getRepository(Outfit).findOne({ where: { id } });

        // check the existence of mainTopId, subTopId, bottomId, and shoeId in garment table
        if (data.mainTopId) {
            const mainTop = await datasource.getRepository(Garment).findOne({ where: { id: data.mainTopId } });

            if (mainTop) {
                if (mainTop.category !== "Haut principal") {
                    throw new Error("Main top category must be Haut principal but is " + mainTop.category);
                }
            } else {
                throw new Error("Main top not found");
            }
        }

        if (data.subTopId) {
            const subTop = await datasource.getRepository(Garment).findOne({ where: { id: data.subTopId } });

            if (subTop) {
                if (subTop.category !== "Haut secondaire") {
                    throw new Error("Sub top category must be Haut secondaire but is " + subTop.category);
                }
            } else {
                throw new Error("Sub top not found");
            }
        }

        if (data.bottomId) {
            const bottom = await datasource.getRepository(Garment).findOne({ where: { id: data.bottomId } });

            if (bottom) {
                if (bottom.category !== "Bas") {
                    throw new Error("Bottom category must be Bas but is " + bottom.category);
                }
            } else {
                throw new Error("Bottom not found");
            }
        }

        if (data.shoeId) {
            const shoe = await datasource.getRepository(Garment).findOne({ where: { id: data.shoeId } });

            if (shoe) {
                if (shoe.category !== "Chaussure") {
                    throw new Error("Shoe category must be Chaussures but is " + shoe.category);
                }
            } else {
                throw new Error("Shoe not found");
            }
        }
        
        return await datasource.getRepository(Outfit).save({ ...outfit, ...data, updated_at: new Date() });
    }

    @Authorized()
    @Mutation(() => Boolean)
    async deleteOutfit(
        @Arg("id") id: number
    ) : Promise<boolean> {
        const outfit = await datasource.getRepository(Outfit).findOne({ where: { id } });
        if (!outfit) {
            return false;
        }
        await datasource.getRepository(Outfit).delete({ id });
        return true;
    }

    @Authorized()
    @Query(() => [Outfit])
    async outfits(
        @Ctx() context: IContext
    ) : Promise<Outfit[]> {
        return await datasource.getRepository(Outfit).find({ where: { userId: context.user.id } });
    }

    @Authorized()
    @Query(() => Outfit)
    async outfit(
        @Arg("id") id: number,
        @Ctx() context: IContext
    ) : Promise<Outfit> {
        return await datasource.getRepository(Outfit).findOne({ where: { id, userId: context.user.id } });
    }

}