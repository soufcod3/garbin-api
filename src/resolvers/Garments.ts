import { Garment, GarmentInput } from '../entities/Garment';
import { Arg, Authorized, Mutation, Resolver } from "type-graphql";
import datasource from "../utils";

@Resolver()
export class GarmentsResolver {
    @Mutation(() => Garment)
    async createGarment(
        @Arg("data", () => GarmentInput) data: GarmentInput
    ) : Promise<Garment> {
            return await datasource.getRepository(Garment).save(data);
    }

    // updateGarment mutation based on GarmentInput
    @Authorized()
    @Mutation(() => Garment)
    async updateGarment(
        @Arg("id") id: number,
        @Arg("data", () => GarmentInput) data: GarmentInput
    ) : Promise<Garment> {
        const garment = await datasource.getRepository(Garment).findOne({ where: { id } });
        return await datasource.getRepository(Garment).save({ ...garment, ...data, updated_at: new Date() });
    }

}