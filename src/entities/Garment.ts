import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";
import { Outfit } from "./Outfit";

const today = new Date();

@Entity()
@ObjectType()
export class Garment {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    userId: number;

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    brand: string;

    @Column()
    @Field()
    size: string;

    @Column("text", { array: true })
    @Field(() => [String])
    colors: string[];

    @Column()
    @Field()
    category: string;

    @Column("int", { array: true, nullable: true, default: [] })
    @Field(() => [Number], { nullable: true })
    outfitIds: number[] = [];

    @Column({ default: today })
    @Field()
    created_at: Date;

    // updated at nullable
    @Column({ nullable: true })
    @Field({ nullable: true })
    updated_at: Date;


}

@InputType()
export class GarmentInput {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    brand: string;

    @Field({ nullable: true })
    size: string;
    
    // make it nullable
    @Field(() => [String], { nullable: true })
    colors: string[];

    @Field({ nullable: true })
    category: string;
}