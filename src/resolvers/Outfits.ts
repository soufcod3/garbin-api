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
        let mainTop = null;
        let subTop = null;
        let bottom = null;
        let shoe = null;

        if (data.mainTopId) {
            const foundMainTop = await datasource.getRepository(Garment).findOne({ where: { id: data.mainTopId, category: "Haut principal" } });
            if (foundMainTop) {
                mainTop = foundMainTop;
            } else {
                throw new Error("Main top not found");
            }
        }

        if (data.subTopId) {
            const foundSubTop = await datasource.getRepository(Garment).findOne({ where: { id: data.subTopId, category: "Haut secondaire" } });
            if (foundSubTop) {
                subTop = foundSubTop;
            } else {
                throw new Error("Sub top not found");
            }
        }

        if (data.bottomId) {
            const foundBottom = await datasource.getRepository(Garment).findOne({ where: { id: data.bottomId, category: "Bas" } });
            if (foundBottom) {
                bottom = foundBottom;
            } else {
                throw new Error("Bottom not found");
            }
        }

        if (data.shoeId) {
            const foundShoe = await datasource.getRepository(Garment).findOne({ where: { id: data.shoeId, category: "Chaussures" } });
            if (foundShoe) {
                shoe = foundShoe;
            } else {
                throw new Error("Shoe not found");
            }
        }

         // Create and save the new outfit
        const newOutfit = await datasource.getRepository(Outfit).save({
            ...data, 
            userId: context.user.id, 
            mainTop, 
            subTop, 
            bottom, 
            shoe 
        });

        // Update garments with the newly created outfit in their outfits array
        if (mainTop) {
            console.log('MAINTOP', mainTop)
            if (!mainTop.outfitIds.includes(newOutfit.id)) {
                mainTop.outfitIds.push(newOutfit.id);
            }
            await datasource.getRepository(Garment).save(mainTop);
        }

        if (subTop) {
            console.log('SUBTOP', subTop)
            if (!subTop.outfitIds.includes(newOutfit.id)) {
                subTop.outfitIds.push(newOutfit.id);
            }
            await datasource.getRepository(Garment).save(subTop);
        }

        if (bottom) {
            console.log('BOTTOM', bottom)
            if (!bottom.outfitIds.includes(newOutfit.id)) {
                bottom.outfitIds.push(newOutfit.id);
            }
            await datasource.getRepository(Garment).save(bottom);
        }

        if (shoe) {
            console.log('SHOE', shoe)
            if (!shoe.outfitIds.includes(newOutfit.id)) {
                shoe.outfitIds.push(newOutfit.id);
            }
            await datasource.getRepository(Garment).save(shoe);
        }

        return newOutfit;
    }

    @Authorized()
    @Mutation(() => Outfit)
    async updateOutfit(
        @Arg("id") id: number,
        @Arg("data", () => OutfitInput) data: OutfitInput
    ) : Promise<Outfit> {
        let foundMainTop = null;
        let newSubTop = null;
        let newBottom = null;
        let newShoe = null;

        // ⚠️ remove old outfitId from each garment

        const outfit = await datasource.getRepository(Outfit).findOne({ where: { id }, relations: ["mainTop", "subTop", "bottom", "shoe"] });

        if (data.mainTopId) {
            foundMainTop = await datasource.getRepository(Garment).findOne({ where: { id: data.mainTopId, category: "Haut principal" } });
            if (foundMainTop) {
                if (foundMainTop.id !== outfit.mainTop?.id) {
                    // replace the mainTop in outfit with the new found mainTop
                    outfit.mainTop = foundMainTop;

                    if (!foundMainTop.outfitIds.includes(outfit.id)) {
                        foundMainTop.outfitIds.push(outfit.id);
                    }

                    // save the garment
                    await datasource.getRepository(Garment).save(foundMainTop);
                }
            } else {
                throw new Error(`Main top not found. Maybe ${data.name} has not the category Haut principal`);
            }
        }
        
        const garmentsToUpdate = {
            mainTop: foundMainTop || outfit.mainTop,
            subTop: newSubTop || outfit.subTop,
            bottom: newBottom || outfit.bottom,
            shoe: newShoe || outfit.shoe
        }
        
        return await datasource.getRepository(Outfit).save({ ...outfit, ...data, ...garmentsToUpdate,  updated_at: new Date() });
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
        return await datasource.getRepository(Outfit).find({ where: { userId: context.user.id }, relations: ["mainTop", "subTop", "bottom", "shoe"] });
    }

    @Authorized()
    @Query(() => Outfit)
    async outfit(
        @Arg("id") id: number,
        @Ctx() context: IContext
    ) : Promise<Outfit> {
        return await datasource.getRepository(Outfit).findOne({ where: { id, userId: context.user.id }, relations: ["mainTop", "subTop", "bottom", "shoe"] });
    }

}