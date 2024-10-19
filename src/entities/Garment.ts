import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID, InputType } from "type-graphql";

const today = new Date();

@Entity()
@ObjectType()
export class Garment {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

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

    @Column({ default: today })
    @Field()
    created_at: Date;

    // updated at
    @Column({ default: null })
    @Field()
    updated_at: Date;

    //   @Column()
    //   @OneToMany(() => Outfit, outfit => outfit.id)
    //   outfits: Outfit[];

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