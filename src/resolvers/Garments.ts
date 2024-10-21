import { Garment, GarmentInput } from '../entities/Garment';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import datasource from "../utils";
import { IContext } from './Users';
import { removeTransparentAreas } from '../services/jimp';
import { removeBackground } from '../services/removeBg';
import { uploadToCloudinary } from '../services/cloudinary';
@Resolver()
export class GarmentsResolver {

    @Authorized()
    @Mutation(() => Garment)
    async createGarment(
        @Arg("data", () => GarmentInput) data: GarmentInput,
        @Ctx() context: IContext
    ) : Promise<Garment> {

        try {
            // Step 0: Remove transparent areas from the image
            const croppedBuffer = await removeTransparentAreas(data.imageBase64);

            // Step 1: Remove background
            const noBgBuffer = await removeBackground(croppedBuffer);
      
            // Step 2: Upload the background-free image to Cloudinary
            const imageUrl = await uploadToCloudinary(noBgBuffer);
      
            // Step 3: Create the garment with the Cloudinary image URL
            const garment = datasource.getRepository(Garment).create({
              ...data,
              userId: context.user.id,
              imageUrl // Store the Cloudinary URL
            });
      
            await datasource.getRepository(Garment).save(garment);
            return garment;
            
          } catch (error) {
            console.error("Error uploading image or creating garment:", error);
            throw new Error("Failed to create garment with image.");
          }

        
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
        return await datasource.getRepository(Garment).find({ order: { id: "ASC" } });
    }

    @Authorized()
    @Query(() => Garment)
    async garment(
        @Arg("id") id: number
    ) : Promise<Garment> {
        return await datasource.getRepository(Garment).findOne({ where: { id } });
    }

}