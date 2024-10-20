import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

const today = new Date();

@Entity()
@ObjectType()
export class OutfitPlan {
    @PrimaryGeneratedColumn()
    @Field(() => ID)
    id: number;

    @Column()
    @Field()
    name: string;

    @Column()
    @Field()
    outfitId: number;

    @Column()
    @Field()
    date: Date;

    @Column()
    @Field()
    location: string;

    @Column()
    @Field()
    userId: number;

    @Column({ default: today })
    @Field()
    created_at: Date;

    @Column({ nullable: true })
    @Field({ nullable: true })
    updated_at: Date;
}

@InputType()
export class OutfitPlanInput {
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    outfitId: number;

    @Field({ nullable: true })
    date: Date;

    @Field({ nullable: true })
    location: string;
}

