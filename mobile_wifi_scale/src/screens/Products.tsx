import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from "../actions/data";

import {useData, useTheme} from '../hooks';
import {ICategory} from '../constants/types';
import {Block, Button, Input, Product, Text} from '../components';

const Products = () => {
  const data = useData();
  const allProducts = useSelector((state) => state.data.products);
  const [products, setProducts] = useState(allProducts);
  const {colors, gradients, sizes} = useTheme();
  const [selected, setSelected] = useState<ICategory>();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!allProducts.length) {
      dispatch(getProducts());
    }
  }, []);

  // init articles
  useEffect(() => {
    setCategories(data?.categories);
    setSelected(data?.categories[0]);
  }, [data.categories]);

  // update products on category change
  useEffect(() => {
    const category = data?.categories?.find(
      (category) => category?.id === selected?.id,
    );

    const newProducts = allProducts?.filter(
      (article) => article?.category?.id === category?.id,
    );

    setProducts(newProducts);
  }, [selected, setProducts, allProducts]);

  return (
    <Block>
      {/* search input */}
      <Block color={colors.card} flex={0} padding={sizes.padding}>
        <Input search placeholder={'Search'} />
      </Block>

      {/* categories list */}
      <Block color={colors.card} row flex={0} paddingVertical={sizes.padding}>
        <Block
          scroll
          horizontal
          renderToHardwareTextureAndroid
          showsHorizontalScrollIndicator={false}
          contentOffset={{x: -sizes.padding, y: 0}}>
          {categories?.map((category) => {
            const isSelected = category?.id === selected?.id;
            return (
              <Button
                radius={sizes.m}
                marginHorizontal={sizes.s}
                key={`category-${category?.id}}`}
                onPress={() => setSelected(category)}
                gradient={gradients?.[isSelected ? 'primary' : 'light']}>
                <Text
                  p
                  bold={isSelected}
                  white={isSelected}
                  black={!isSelected}
                  transform="capitalize"
                  marginHorizontal={sizes.m}>
                  {category?.name}
                </Text>
              </Button>
            );
          })}
        </Block>
      </Block>

      {/* products list */}
      <Block
        scroll
        paddingHorizontal={sizes.padding}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: sizes.l}}>
        <Block row wrap="wrap" justify="space-between" marginTop={sizes.sm}>
          {products?.map((product) => (
            <Product {...product} key={`card-${product?.id}`} />
          ))}
        </Block>
      </Block>
    </Block>
  );
};

export default Products;
